import { db } from "../connect.js";

export const addSales = (req, res) => {
  console.log(req.body);
  const q1 =
    "INSERT INTO sale_module (`sale_name`,`sale_prefix`,`sale_prefix_no`,`sale_amt`, `sale_date` , cust_cnct_id , sale_amt_paid , sale_amt_due , sale_amt_type, sale_acc_id  ) VALUES(?)";
  const values1 = [
    req.body.sale_name,
    req.body.sale_prefix,
    req.body.sale_prefix_no,
    req.body.sale_amt,
    req.body.sale_date,
    req.body.cust_cnct_id,
    req.body.sale_amt_paid,
    req.body.sale_amt_due,
    req.body.sale_amt_type,
    req.body.sale_acc_id,
  ];
  db.query(q1, [values1], (err, data) => {
    if (err) return res.status(500).json(err);
    const id1 = data.insertId;
    const q2 =
      "INSERT INTO sale_tran ( `sale_cnct_id`, `sale_item_name`, `sale_item_qty`, `sale_item_price`, `sale_item_code` ,`sale_item_unit` , `sale_item_disc_unit` , `sale_item_disc_val` , `sale_item_disc_price` , `sale_item_gst` , `sale_item_cess`  , `sale_item_gst_amt`, `sale_item_type`, `sale_item_cnct_id`, `sale_tax`) Values ?";
    const values2 = req.body.invoiceItemsList.map((values) => [
      id1,
      values.in_items,
      values.in_qty,
      values.in_sale_price,
      values.in_hsn_sac,
      values.in_unit,
      values.in_discount_unit,
      values.in_discount_value,
      values.in_discount_price,
      values.in_gst_prectentage,
      values.in_cess_prectentage,
      values.in_gst_amt,
      values.sale_item_type,
      values.in_id,
      values.in_tax,
    ]);

    db.query(q2, [values2], (err, data) => {
      if (err) return res.status(500).json(err);

      var id2 = 0;
      if (req.body.sale_amt_type !== "unpaid") {
        const q1 =
          "INSERT INTO sale_module (`sale_prefix` , `sale_prefix_no` , `sale_name` , `sale_date` , `cust_cnct_id` , `sale_amt_type` ,  `sale_amt_paid` , `sale_payment_in_id` , `sale_payment_in_prefix` , `sale_payment_in_prefix_no` , `sale_acc_id`  ) VALUES(?)";
        const values1 = [
          req.body.sale_prefix,
          req.body.sale_prefix_no,
          req.body.sale_name,
          req.body.sale_date,
          req.body.cust_cnct_id,
          req.body.sale_amt_type,
          req.body.sale_amt_paid,
          id1,
          req.body.payment_in_prefix,
          req.body.payment_in_prefix_no,
          req.body.sale_acc_id,
        ];
        db.query(q1, [values1], (err, data) => {
          if (err) return res.status(500).json(err);
          id2 = data.insertId;

          const custData =
            "INSERT INTO customer_tran(`tran_receive`,`tran_date`,`cnct_id` , `tran_sale_cnct_id`) VALUES (?)";
          const custValues = [
            req.body.sale_amt_paid,
            req.body.sale_date,
            req.body.cust_cnct_id,
            id2,
          ];
          db.query(custData, [custValues], (err, data) => {
            if (err) return res.status(500).json(err);
            const cashBookData =
              "INSERT INTO cashbook_module (`cash_receive`,`cash_mode`,`cash_date`, `cash_description` , `cash_sale_cnct_id` , `cash_acc_id`) VALUES (?)";
            const cashBookValues = [
              req.body.sale_amt_paid,
              req.body.sale_amt_type,
              req.body.sale_date,
              req.body.sale_desc,
              id2,
              req.body.sale_acc_id,
            ];
            if (req.body.sale_desc === "PAYMENT IN") {
              db.query(cashBookData, [cashBookValues], (err, data) => {
                if (err) return res.status(500).json(err);
              });
            }
          });
        });
      }

      const q3 =
        "INSERT INTO stock_data (`product_stock_out` ,`primary_unit`, `sale_price`,`entry_date`,`cnct_id`,`selected_unit` , `sale_cnct_id`) VALUES ?";
      const values3 = req.body.invoiceItemsList
        .filter((i) => i.in_cat === 1)
        .map((item) => [
          item.in_qty,
          item.in_unit,
          item.in_sale_price,
          req.body.sale_date,
          item.in_id,
          item.in_unit,
          id1,
        ]);

      const q4 =
        "INSERT INTO service_tran (`ser_tran_price`,`ser_quantity`,`ser_date`,`ser_cnct_id` , `sale_cnct_id`) VALUES ?";
      const values4 = req.body.invoiceItemsList
        .filter((i) => i.in_cat === 0)
        .map((item) => [
          item.in_sale_price,
          item.in_qty,
          req.body.sale_date,
          item.in_id,
          id1,
        ]);

      if (values3.length > 0) {
        db.query(q3, [values3], (err, data) => {
          if (err) return res.status(500).json(err);
          if (values4.length > 0) {
            db.query(q4, [values4], (err, data) => {
              if (err) return res.status(500).json(err);
              return res.status(200).json("Transaction has been Entered");
            });
          } else {
            return res.status(200).json("Transaction has been Entered");
          }
        });
      } else {
        if (values4.length > 0) {
          db.query(q4, [values4], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Transaction has been Entered");
          });
        }
      }
    });
  });
};

export const updateProductStockQty = (req, res) => {
  console.log("req.body.invoiceItemsList : ", req.body.invoiceItemsList);
  var query = "UPDATE product_module SET balance_stock = CASE ";
  const cases = req.body.invoiceItemsList
    .filter((i) => i.in_cat === 1)
    .map(
      (update) =>
        `WHEN product_id = ${update.in_id} THEN '${update.in_b_stock}'`
    )
    .join(" ");
  query += `${cases} END WHERE product_id IN (${req.body.invoiceItemsList
    .map((update) => update.in_id)
    .join(", ")})`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    } else {
      res.send("Multiple rows updated successfully");
    }
  });
};

// export const updateProductStockQty = (req, res) => {
//   var query = "UPDATE product_module SET balance_stock = CASE ";
//   const cases = req.body.invoiceItemsList
//     .filter((i) => i.in_cat === 1)
//     .map(
//       (update) =>
//         `WHEN product_id = ${update.in_id} THEN '${update.in_b_stock}'`
//     )
//     .join(" ");
//   query += `${cases} END WHERE product_id IN (${req.body.invoiceItemsList
//     .map((update) => update.in_id)
//     .join(", ")})`;

//   db.query(query, (err, result) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send("An error occurred");
//     } else {
//       res.send("Multiple rows updated successfully");
//     }
//   });
// };

export const updateServicesSalesQty = (req, res) => {
  var query = "UPDATE service_module SET ser_sales = CASE ";
  const cases = req.body.invoiceItemsList
    .filter((i) => i.in_cat === 0)
    .map(
      (update) => `WHEN ser_id = ${update.in_id} THEN '${update.in_sales_no}'`
    )
    .join(" ");
  query += `${cases} END WHERE ser_id IN (${req.body.invoiceItemsList
    .map((update) => update.in_id)
    .join(", ")})`;

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    } else {
      res.send("Multiple rows updated successfully");
    }
  });
};

export const fetchData = (req, res) => {
  const q = "SELECT * from sale_module where sale_acc_id = ?";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchDataById = (req, res) => {
  const q = "SELECT * from sale_module where sale_id = ?";
  db.query(q, [req.params.saleId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchSaleTran = (req, res) => {
  const q = "SELECT * from sale_tran WHERE sale_cnct_id = ?";
  db.query(q, [req.params.saleId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchSalesPrefixData = (req, res) => {
  const q =
    "select distinct sale_prefix , max(sale_prefix_no) as sale_prefix_no from sale_module  where sale_acc_id = ? group by sale_prefix ORDER By sale_prefix = 'Invoice' DESC ;";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const delSales = (req, res) => {
  const q =
    "DELETE sale_module.* , sale_tran.*, cashbook_module.* , stock_data.* , customer_tran.* from sale_module LEFT JOIN sale_tran ON sale_module.sale_id = sale_tran.sale_tran_id LEFT JOIN cashbook_module on sale_module.sale_id = cashbook_module.cash_sale_cnct_id LEFT JOIN customer_tran on sale_module.sale_id = customer_tran.tran_sale_cnct_id LEFT JOIN stock_data on sale_module.sale_id = stock_data.sale_cnct_id LEFT JOIN service_tran on sale_module.sale_id = service_tran.sale_cnct_id WHERE sale_id = ? or sale_payment_in_id = ? and stock_data.product_stock_out is NOT NULL;";

  db.query(q, [req.params.saleId, req.params.saleId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("DELETED SUCCESSFULLY");
  });
};

export const addSalePayment = (req, res) => {
  const q1 =
    "INSERT INTO sale_module (`sale_prefix` , `sale_prefix_no` , `sale_name` , `sale_date` , `cust_cnct_id` , `sale_amt_type` ,  `sale_amt_paid` , `sale_payment_in_id` , `sale_payment_in_prefix` , `sale_payment_in_prefix_no` , `sale_acc_id`  ) VALUES(?)";
  const values1 = [
    req.body.sale_prefix,
    req.body.sale_prefix_no,
    req.body.sale_name,
    req.body.sale_amt_in_date,
    req.body.sale_cust_cnct_id,
    req.body.sale_amt_in_mode,
    req.body.sale_amt_in,
    req.body.sale_cnct_id,
    req.body.sale_payment_in_prefix,
    req.body.sale_payment_in_prefix_no,
    req.body.sale_acc_id,
  ];
  db.query(q1, [values1], (err, data) => {
    if (err) return res.status(500).json(err);
    const id1 = data.insertId;

    const custData =
      "INSERT INTO customer_tran(`tran_receive`,`tran_date`,`cnct_id` , `tran_sale_cnct_id`) VALUES (?)";
    const custValues = [
      req.body.sale_amt_in,
      req.body.sale_amt_in_date,
      req.body.sale_cust_cnct_id,
      //req.body.sale_cnct_id,
      id1,
    ];
    db.query(custData, [custValues], (err, data) => {
      if (err) return res.status(500).json(err);
      const cashBookData =
        "INSERT INTO cashbook_module (`cash_receive`,`cash_mode`,`cash_date`, `cash_description` , `cash_sale_cnct_id`, `cash_acc_id`) VALUES (?)";
      const cashBookValues = [
        req.body.sale_amt_in,
        req.body.sale_amt_in_mode,
        req.body.sale_amt_in_date,
        req.body.sale_desc,
        //req.body.sale_cnct_id,
        id1,
        req.body.sale_acc_id,
      ];
      db.query(cashBookData, [cashBookValues], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("INSERTED SUCCESSFULLY");
      });
    });
  });
};

export const updateBalanceDue = (req, res) => {
  const q =
    "UPDATE sale_module SET sale_amt_paid = ? ,sale_amt_due = ? where sale_id = ?";
  const values = [req.body.amt_paid, req.body.amt_due, req.body.sale_cnct_id];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};

export const fetchPaymentPrefixData = (req, res) => {
  const q =
    "select max(CAST(sale_payment_in_prefix_no AS signed ) ) as sale_payment_in_prefix_no from sale_module where sale_acc_id = ?;";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const updateExpenses = (req, res) => {
  const values = [
    req.body.exp_date,
    req.body.exp_category,
    req.body.exp_total,
    req.params.expId,
  ];
  console.log(values);

  const q =
    "UPDATE expenses_module SET exp_date = ? ,exp_category = ? ,exp_total = ? WHERE exp_id = ?";

  db.query(q, values, (err, data) => {
    console.log(values);
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};

export const fetchDataByIdAndPaymentInId = (req, res) => {
  const q =
    "SELECT * from sale_module where sale_id = ? or sale_payment_in_id = ?;";
  db.query(q, [req.params.saleId, req.params.saleId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const updateSale = (req, res) => {
  const cashQuery =
    "UPDATE cashbook_module SET cash_receive = ? ,cash_mode = ? , cash_date = ? WHERE cash_sale_cnct_id = ?";
  const cashData = [
    req.body.sale_amt_paid,
    req.body.sale_amt_type,
    req.body.sale_date,
    req.body.sale_id,
  ];
  db.query(cashQuery, cashData, (err, data) => {
    if (err) return res.status(500).json(err);
    const custQuery =
      "UPDATE customer_tran SET tran_receive = ?, tran_date = ? WHERE tran_sale_cnct_id = ?";
    const custData = [
      req.body.sale_amt_paid,
      req.body.sale_date,
      req.body.sale_id,
    ];
    db.query(custQuery, custData, (err, data) => {
      if (err) return res.status(500).json(err);

      const salePaymentInQuery =
        "UPDATE sale_module SET sale_amt_paid = ?, sale_amt_type = ? WHERE sale_id = ?";
      const salePaymentInData = [
        req.body.sale_amt_paid,
        req.body.sale_amt_type,
        req.body.sale_id,
      ];
      db.query(salePaymentInQuery, salePaymentInData, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Updated Successfully");
      });
    });
  });
};

export const delPayIn = (req, res) => {
  const q =
    "DELETE sale_module.* , cashbook_module.* , customer_tran.* from sale_module LEFT JOIN cashbook_module on sale_module.sale_id = cashbook_module.cash_sale_cnct_id LEFT JOIN customer_tran on sale_module.sale_id = customer_tran.tran_sale_cnct_id where sale_id = ? or sale_payment_in_id = ? ;";
  db.query(q, [req.params.saleId, req.params.saleId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("DELETED SUCCESSFULLY");
  });
};

export const delSaleReturn = (req, res) => {
  const q =
    "DELETE sale_module.* , cashbook_module.* , stock_data.*, service_tran.* , customer_tran.* from sale_module LEFT JOIN cashbook_module on sale_module.sale_id = cashbook_module.cash_sale_cnct_id LEFT JOIN customer_tran on sale_module.sale_id = customer_tran.tran_sale_cnct_id LEFT JOIN stock_data on sale_module.sale_id = stock_data.sale_cnct_id LEFT JOIN service_tran on sale_module.sale_id = service_tran.sale_cnct_id WHERE sale_id = ? ;";
  db.query(q, [req.params.saleId, req.params.saleId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("DELETED SUCCESSFULLY");
  });
};

export const fetchSalePayPrefixData = (req, res) => {
  const q =
    "select max(sale_payment_in_prefix_no) as sale_payment_in_prefix_no from sale_module where sale_acc_id = ?;";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const invoiceProItemList = (req, res) => {
  const q1 =
    "SELECT distinct sale_item_cnct_id as product_id , sale_item_name , '0' as deleted ,  sale_item_qty  ,sale_item_price FROM sale_tran WHERE sale_cnct_id = ? and sale_item_type = 'pro' union SELECT distinct sale_item_cnct_id , sale_item_name , '1' as deleted ,  sale_item_qty  ,sale_item_price FROM sale_tran WHERE sale_cnct_id = ? and sale_item_type = 'pro' and sale_item_cnct_id NOT IN (SELECT product_id FROM product_module ) union SELECT product_id , product_name COLLATE utf8mb4_general_ci , '0' as deleted , '0' as qty , sale_price FROM product_module WHERE acc_id = ? and product_id NOT IN (SELECT sale_item_cnct_id FROM sale_tran WHERE sale_cnct_id = ? and sale_item_type = 'pro');";
  db.query(
    q1,
    [req.params.saleId, req.params.saleId, req.params.accId, req.params.saleId],
    (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    }
  );
};

export const invoiceSerItemList = (req, res) => {
  const q1 =
    "SELECT distinct sale_item_cnct_id as ser_id , sale_item_name , '0' as deleted ,  sale_item_qty  ,sale_item_price FROM sale_tran WHERE sale_cnct_id = ? and sale_item_type = 'ser' union SELECT distinct sale_item_cnct_id , sale_item_name , '1' as deleted ,  sale_item_qty  ,sale_item_price FROM sale_tran WHERE sale_cnct_id = ? and sale_item_type = 'ser' and sale_item_cnct_id NOT IN (SELECT ser_id FROM service_module ) union SELECT ser_id , ser_name , '0' as deleted , '0' as ser_qty , ser_price FROM service_module WHERE ser_acc_id = ? and ser_id NOT IN (SELECT sale_item_cnct_id FROM sale_tran WHERE sale_cnct_id = ? and sale_item_type = 'ser');";
  db.query(
    q1,
    [req.params.saleId, req.params.saleId, req.params.accId, req.params.saleId],
    (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    }
  );
};


export const updateSaleItems = (req, res) => {
    const q2 =
    "INSERT INTO sale_tran (`sale_tax`, `sale_cnct_id`, `sale_item_name`, `sale_item_qty`, `sale_item_price`, `sale_item_code` ,`sale_item_unit` , `sale_item_disc_unit` , `sale_item_disc_val` , `sale_item_disc_price` , `sale_item_gst` , `sale_item_cess` , `sale_item_gst_amt` , `sale_item_cnct_id`, `sale_item_type`) Values ?";
  const values2 = req.body.invoiceItemsList.map((values) => [
    values.in_tax,
    req.body.sale_id,
    values.in_items,
    values.in_qty,
    values.in_sale_price,
    values.in_hsn_sac,
    values.in_unit,
    values.in_discount_unit,
    values.in_discount_value,
    values.in_discount_price,
    values.in_gst_prectentage,
    values.in_cess_prectentage,
    values.in_gst_amt,
    values.in_id,
    values.sale_item_type,
  ]);

    db.query(q2, [values2], (err, data) => {
      if (err) return res.status(500).json(err);

      var id2 = 0;
      if (req.body.sale_amt_type !== "unpaid") {
        const q1 =
        "INSERT INTO sale_module (`sale_prefix` , `sale_prefix_no` , `sale_name` , `sale_date` , `cust_cnct_id` , `sale_amt_type` ,  `sale_amt_paid` , `sale_payment_in_id` , `sale_payment_in_prefix` , `sale_payment_in_prefix_no` , `sale_acc_id`  ) VALUES(?)";
      const values1 = [
        req.body.sale_prefix,
        req.body.sale_prefix_no,
        req.body.sale_name,
        req.body.sale_date,
        req.body.sup_cnct_id,
        req.body.sale_amt_type,
        req.body.sale_amt_paid,
        req.body.sale_id,
        req.body.sale_payment_in_prefix,
        req.body.sale_payment_in_prefix_no,
        req.body.sale_acc_id,
      ];
        db.query(q1, [values1], (err, data) => {
          if (err) return res.status(500).json(err);
          id2 = data.insertId;

          const custData =
          "INSERT INTO customer_tran(`tran_receive`,`tran_date`,`cnct_id` , `tran_sale_cnct_id`) VALUES (?)";
        const custValues = [
          req.body.sale_amt_paid,
          req.body.sale_date,
          req.body.cust_cnct_id,
          id2,
        ];
          db.query(custData, [custValues], (err, data) => {
            if (err) return res.status(500).json(err);
            const cashBookData =
              "INSERT INTO cashbook_module (`cash_pay`,`cash_mode`,`cash_date`, `cash_description` , `cash_sale_cnct_id` ,`cash_acc_id`) VALUES (?)";
            const cashBookValues = [
              req.body.sale_amt_paid,
              req.body.sale_amt_type,
              req.body.sale_date,
              req.body.sale_desc,
              id2,
              req.body.sale_acc_id,
            ];
            if (req.body.sale_desc === "PAYMENT IN") {
              db.query(cashBookData, [cashBookValues], (err, data) => {
                if (err) return res.status(500).json(err);
              });
            }
          });
        });
      }

      const proQuery =
        "INSERT INTO stock_data (`product_stock_out` ,`primary_unit`, `sale_price`,`entry_date`,`cnct_id`,`selected_unit` , `sale_cnct_id`) VALUES ?";

      const proValues = req.body.invoiceItemsList
        .filter((i) => i.in_cat === 1)
        .map((item) => [
          item.in_qty,
          item.in_unit,
          item.in_sale_price,
          req.body.sale_date,
          item.in_id,
          item.in_unit,
          req.body.sale_id,
        ]);

      const serQuery =
        "INSERT INTO service_tran (`ser_tran_price`,`ser_quantity`,`ser_date`,`ser_cnct_id` , `sale_cnct_id`) VALUES ?";
      const serValues = req.body.invoiceItemsList
        .filter((i) => i.in_cat === 0)
        .map((item) => [
          item.in_sale_price,
          item.in_qty,
          req.body.sale_date,
          item.in_id,
          req.body.sale_id,
        ]);

      if (proValues.length > 0) {
        console.log("proValues.length : ", proValues.length);
        db.query(proQuery, [proValues], (err, data) => {
          if (err) return res.status(500).json(err);
          if (serValues.length > 0) {
            db.query(serQuery, [serValues], (err, data) => {
              if (err) return res.status(500).json(err);
              return res.status(200).json("Transaction has been Entered");
            });
          } else {
            return res.status(200).json("Transaction has been Entered");
          }
        });
      } else {
        if (serValues.length > 0) {
          console.log("serValues.length : ", serValues.length);
          db.query(serQuery, [serValues], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Transaction has been Entered");
          });
        }
      }
    });
  
};


export const deleteSaleItems = (req, res) => {
  const q1 =
    "DELETE sale_tran.* , stock_data.* , service_tran.* from sale_tran LEFT JOIN stock_data ON sale_tran.sale_cnct_id = stock_data.sale_cnct_id LEFT JOIN service_tran ON sale_tran.sale_cnct_id = service_tran.sale_cnct_id WHERE sale_tran.sale_cnct_id = ?;";
  db.query(q1, [req.params.saleId], (err, data) => {
    console.log("Deleted", req.params.saleId);
    if (err) return res.status(500).json(err);
    return res.status(200).json("Deleted");
  });
};

export const updateSaleModuleTran = (req, res) => {
  const saleData = [
    req.body.sale_amt,
    req.body.sale_date,
    req.body.sale_amt_type,
    req.body.sale_id,
  ];
  console.log("saleData : ", saleData);
  const saleQuery =
    "UPDATE sale_module SET sale_amt = ? ,sale_date = ? , sale_amt_type = ? WHERE sale_id = ?";
  db.query(saleQuery, saleData, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("updated");
  });
};

export const returnSale = (req, res) => {
  let id2 = 0;
  if (req.body.sale_amt_type !== "unpaid") {
    const q1 =
      "INSERT INTO sale_module (`sale_prefix` , `sale_prefix_no` , `sale_name` , `sale_date` , `cust_cnct_id` , `sale_amt_type` ,  `sale_amt_paid` , `sale_re_id` , `sale_re_prefix` , `sale_re_prefix_no` , `sale_acc_id`  ) VALUES(?)";
    const values1 = [
      req.body.sale_prefix,
      req.body.sale_prefix_no,
      req.body.sale_name,
      req.body.sale_date,
      req.body.sup_cnct_id,
      req.body.sale_amt_type,
      req.body.sale_refund_amt,
      req.body.sale_id,
      req.body.sale_re_prefix,
      req.body.sale_re_prefix_no,
      req.body.sale_acc_id,
    ];
    db.query(q1, [values1], (err, data) => {
      if (err) return res.status(500).json(err);
      id2 = data.insertId;

      const custData =
        "INSERT INTO customer_tran(`tran_pay`,`tran_date`,`cnct_id`, `tran_sale_cnct_id`) VALUES (?)";
      const custValues = [
        req.body.sale_refund_amt,
        req.body.sale_date,
        req.body.cust_cnct_id,
        id2,
      ];
      db.query(custData, [custValues], (err, data) => {
        if (err) return res.status(500).json(err);

        if (req.body.sale_desc === "PAYMENT OUT") {
          const cashBookData =
            "INSERT INTO cashbook_module (`cash_pay`,`cash_mode`,`cash_date`, `cash_description` , `cash_sale_cnct_id` ,`cash_acc_id`) VALUES (?)";
          const cashBookValues = [
            req.body.sale_refund_amt,
            req.body.sale_amt_type,
            req.body.sale_date,
            //req.body.sale_desc,
            "PAYMENT OUT",
            id2,
            req.body.sale_acc_id,
          ];
          db.query(cashBookData, [cashBookValues], (err, data) => {
            if (err) return res.status(500).json(err);

            const proQuery =
              "INSERT INTO stock_data (`product_stock_in` ,`primary_unit`, `purchase_price`,`entry_date`,`cnct_id`,`selected_unit` , `sale_cnct_id`) VALUES ?";

            const proValues = req.body.invoiceItemsList
              .filter((i) => i.sale_item_type === "pro")
              .map((item) => [
                item.sale_item_qty,
                item.sale_item_unit,
                item.sale_item_price,
                req.body.sale_date,
                item.sale_item_cnct_id,
                item.sale_item_unit,
                id2,
              ]);

            const serQuery =
              "INSERT INTO service_tran (`ser_return` , `ser_tran_price`,`ser_date`,`ser_cnct_id` , `sale_cnct_id`) VALUES ?";

            const serValues = req.body.invoiceItemsList
              .filter((i) => i.sale_item_type === "ser")
              .map((item) => [
                item.sale_item_qty,
                item.sale_item_price,
                req.body.sale_date,
                item.sale_item_cnct_id,
                id2,
              ]);

            if (proValues.length > 0) {
              db.query(proQuery, [proValues], (err, data) => {
                if (err) return res.status(500).json(err);
                if (serValues.length > 0) {
                  db.query(serQuery, [serValues], (err, data) => {
                    if (err) return res.status(500).json(err);
                    return res.status(200).json("Transaction has been Entered");
                  });
                } else {
                  return res.status(200).json("Transaction has been Entered");
                }
              });
            } else {
              if (serValues.length > 0) {
                db.query(serQuery, [serValues], (err, data) => {
                  if (err) return res.status(500).json(err);
                  return res.status(200).json("Transaction has been Entered");
                });
              }
            }
          });
        }
      });
    });
  } else {
    return res.status(200).json("Transaction has been Entered");
  }
};

export const fetchSaleReturnPrefixData = (req, res) => {
  const q =
    "select max(CAST(sale_re_prefix_no as SIGNED)) as sale_re_prefix_no from sale_module where sale_acc_id = ?;";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
