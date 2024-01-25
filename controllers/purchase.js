import { db } from "../connect.js";

export const addPurchase = (req, res) => {
  console.log(req.body);
  const q1 =
    "INSERT INTO purchase_module (`purchase_name`,`purchase_prefix`,`purchase_prefix_no`,`purchase_amt`, `purchase_date` , sup_cnct_id , purchase_amt_paid , purchase_amt_due , purchase_amt_type , purchase_acc_id ) VALUES(?)";
  const values1 = [
    req.body.purchase_name,
    req.body.purchase_prefix,
    req.body.purchase_prefix_no,
    req.body.purchase_amt,
    req.body.purchase_date,
    req.body.sup_cnct_id,
    req.body.purchase_amt_paid,
    req.body.purchase_amt_due,
    req.body.purchase_amt_type,
    req.body.purchase_acc_id,
  ];
  db.query(q1, [values1], (err, data) => {
    if (err) return res.status(500).json(err);
    const id1 = data.insertId;
    const q2 =
      "INSERT INTO purchase_tran (`purchase_tax`, `purchase_cnct_id`, `purchase_item_name`, `purchase_item_qty`, `purchase_item_price`, `purchase_item_code` ,`purchase_item_unit` , `purchase_item_disc_unit` , `purchase_item_disc_val` , `purchase_item_disc_price` , `purchase_item_gst` , `purchase_item_cess` , `purchase_item_gst_amt` , purchase_item_cnct_id) Values ?";
    const values2 = req.body.invoiceItemsList.map((values) => [
      values.in_tax,
      id1,
      values.in_items,
      values.in_qty,
      values.in_purchase_price,
      values.in_hsn_sac,
      values.in_unit,
      values.in_discount_unit,
      values.in_discount_value,
      values.in_discount_price,
      values.in_gst_prectentage,
      values.in_cess_prectentage,
      values.in_gst_amt,
      values.in_id,
    ]);

    db.query(q2, [values2], (err, data) => {
      if (err) return res.status(500).json(err);

      let id2 = 0;
      if (req.body.purchase_amt_type !== "unpaid") {
        const q1 =
          "INSERT INTO purchase_module (`purchase_prefix` , `purchase_prefix_no` , `purchase_name` , `purchase_date` , `sup_cnct_id` , `purchase_amt_type` ,  `purchase_amt_paid` , `purchase_pay_out_id` , `purchase_pay_out_prefix` , `purchase_pay_out_prefix_no` , `purchase_acc_id`  ) VALUES(?)";
        const values1 = [
          req.body.purchase_prefix,
          req.body.purchase_prefix_no,
          req.body.purchase_name,
          req.body.purchase_date,
          req.body.sup_cnct_id,
          req.body.purchase_amt_type,
          req.body.purchase_amt_paid,
          id1,
          req.body.payment_out_prefix,
          req.body.payment_out_prefix_no,
          req.body.purchase_acc_id,
        ];
        db.query(q1, [values1], (err, data) => {
          if (err) return res.status(500).json(err);
          id2 = data.insertId;
          const supData =
            "INSERT INTO supplier_tran(`sup_tran_pay`,`sup_tran_date`,`sup_tran_cnct_id`, `sup_tran_pur_cnct_id`) VALUES (?)";
          const supValues = [
            req.body.purchase_amt_paid,
            req.body.purchase_date,
            req.body.sup_cnct_id,
            id2,
          ];
          db.query(supData, [supValues], (err, data) => {
            if (err) return res.status(500).json(err);

            if (req.body.purchase_desc === "PAYMENT OUT") {
              const cashBookData =
                "INSERT INTO cashbook_module (`cash_pay`,`cash_mode`,`cash_date`, `cash_description` , `cash_pur_cnct_id` ,`cash_acc_id`) VALUES (?)";
              const cashBookValues = [
                req.body.purchase_amt_paid,
                req.body.purchase_amt_type,
                req.body.purchase_date,
                req.body.purchase_desc,
                id2,
                req.body.purchase_acc_id,
              ];
              db.query(cashBookData, [cashBookValues], (err, data) => {
                if (err) return res.status(500).json(err);
              });
            }
          });
        });
      }

      const q3 =
        "INSERT INTO stock_data (`product_stock_in` ,`primary_unit`, `purchase_price`,`entry_date`,`cnct_id`,`selected_unit` , `pur_cnct_id`) VALUES ?";

      const values3 = req.body.invoiceItemsList
        .filter((i) => i.in_cat === 1)
        .map((item) => [
          item.in_qty,
          item.in_unit,
          item.in_purchase_price,
          req.body.purchase_date,
          item.in_id,
          item.in_unit,
          id1,
        ]);

      db.query(q3, [values3], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Transaction has been Entered");
      });
      //
    });
  });
};

export const updatePurchaseItems = (req, res) => {
  console.log(req.body);

  const q2 =
    "INSERT INTO purchase_tran (`purchase_tax`, `purchase_cnct_id`, `purchase_item_name`, `purchase_item_qty`, `purchase_item_price`, `purchase_item_code` ,`purchase_item_unit` , `purchase_item_disc_unit` , `purchase_item_disc_val` , `purchase_item_disc_price` , `purchase_item_gst` , `purchase_item_cess` , `purchase_item_gst_amt` , purchase_item_cnct_id) Values ?";
  const values2 = req.body.invoiceItemsList.map((values) => [
    values.in_tax,
    req.body.purchase_id,
    values.in_items,
    values.in_qty,
    values.in_purchase_price,
    values.in_hsn_sac,
    values.in_unit,
    values.in_discount_unit,
    values.in_discount_value,
    values.in_discount_price,
    values.in_gst_prectentage,
    values.in_cess_prectentage,
    values.in_gst_amt,
    values.in_id,
  ]);

  db.query(q2, [values2], (err, data) => {
    if (err) return res.status(500).json(err);
    const q3 =
      "INSERT INTO stock_data (`product_stock_in` ,`primary_unit`, `purchase_price`,`entry_date`,`cnct_id`,`selected_unit` , `pur_cnct_id`) VALUES ?";

    const values3 = req.body.invoiceItemsList
      .filter((i) => i.in_cat === 1)
      .map((item) => [
        item.in_qty,
        item.in_unit,
        item.in_purchase_price,
        req.body.purchase_date,
        item.in_id,
        item.in_unit,
        req.body.purchase_id,
      ]);

    db.query(q3, [values3], (err, data) => {
      if (err) return res.status(500).json(err);

      let id2 = 0;

      if (req.body.purchase_amt_type !== "unpaid") {
        const q1 =
          "INSERT INTO purchase_module (`purchase_prefix` , `purchase_prefix_no` , `purchase_name` , `purchase_date` , `sup_cnct_id` , `purchase_amt_type` ,  `purchase_amt_paid` , `purchase_pay_out_id` , `purchase_pay_out_prefix` , `purchase_pay_out_prefix_no` , `purchase_acc_id`  ) VALUES(?)";
        const values1 = [
          req.body.purchase_prefix,
          req.body.purchase_prefix_no,
          req.body.purchase_name,
          req.body.purchase_date,
          req.body.sup_cnct_id,
          req.body.purchase_amt_type,
          req.body.purchase_amt_paid,
          req.body.purchase_id,
          req.body.payment_out_prefix,
          req.body.payment_out_prefix_no,
          req.body.purchase_acc_id,
        ];
        db.query(q1, [values1], (err, data) => {
          if (err) return res.status(500).json(err);
          id2 = data.insertId;
          const supData =
            "INSERT INTO supplier_tran(`sup_tran_pay`,`sup_tran_date`,`sup_tran_cnct_id`, `sup_tran_pur_cnct_id`) VALUES (?)";
          const supValues = [
            req.body.purchase_amt_paid,
            req.body.purchase_date,
            req.body.sup_cnct_id,
            id2,
          ];
          db.query(supData, [supValues], (err, data) => {
            if (err) return res.status(500).json(err);

            if (req.body.purchase_desc === "PAYMENT OUT") {
              const cashBookData =
                "INSERT INTO cashbook_module (`cash_pay`,`cash_mode`,`cash_date`, `cash_description` , `cash_pur_cnct_id` ,`cash_acc_id`) VALUES (?)";
              const cashBookValues = [
                req.body.purchase_amt_paid,
                req.body.purchase_amt_type,
                req.body.purchase_date,
                req.body.purchase_desc,
                id2,
                req.body.purchase_acc_id,
              ];
              db.query(cashBookData, [cashBookValues], (err, data) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Transaction has been Entered");
              });
            }
          });
        });
      } else {
        return res.status(200).json("Transaction has been Entered");
      }
    });
  });
};

export const deletePurchaseItems = (req, res) => {
  const q1 =
    "DELETE purchase_tran.* , stock_data.* from purchase_tran LEFT JOIN stock_data ON purchase_tran.purchase_cnct_id = stock_data.pur_cnct_id WHERE purchase_cnct_id = ?;";
  db.query(q1, [req.params.purchaseId], (err, data) => {
    console.log("Deleted");
    if (err) return res.status(500).json(err);
    return res.status(200).json("Deleted");
  });
};

export const updatePurchaseModuleTran = (req, res) => {
  const purData = [
    req.body.purchase_amt,
    req.body.purchase_date,
    req.body.purchase_amt_type,
    req.body.purchase_id,
  ];

  const purQuery =
    "UPDATE purchase_module SET purchase_amt = ? ,purchase_date = ? , purchase_amt_type = ? WHERE purchase_id = ?";
  db.query(purQuery, purData, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("updated");
  });
};

export const updateProductStockQty = (req, res) => {
  var query = "UPDATE product_module SET balance_stock = CASE ";
  if (req.body.invoiceItemsList) {
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
  } else {
    const cases = req.body
      .map(
        (update) =>
          `WHEN product_id = ${update.purchase_item_cnct_id} THEN '${update.purchase_item_qty}'`
      )
      .join(" ");
    query += `${cases} END WHERE product_id IN (${req.body
      .map((update) => update.purchase_item_cnct_id)
      .join(", ")})`;
  }

  db.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("An error occurred");
    } else {
      res.send("Multiple rows updated successfully");
    }
  });
};

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
  const q = "SELECT * from purchase_module where purchase_acc_id = ?";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchDataById = (req, res) => {
  const q = "SELECT * from purchase_module where purchase_id = ?";
  db.query(q, [req.params.purchaseId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchDataByIdAndPayOutId = (req, res) => {
  const q =
    "SELECT * from purchase_module where purchase_id = ? or purchase_pay_out_id = ?";
  db.query(q, [req.params.purchaseId, req.params.purchaseId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchPurchaseTran = (req, res) => {
  const q = "SELECT * from purchase_tran WHERE purchase_cnct_id = ?";
  db.query(q, [req.params.purchaseId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchPurchasePrefixData = (req, res) => {
  const q =
    "select purchase_prefix , max(CAST(purchase_prefix_no as SIGNED)) as purchase_prefix_no from purchase_module where purchase_acc_id = ? group by purchase_prefix ;";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const delPurchase = (req, res) => {
  const q =
    "DELETE purchase_module.* , purchase_tran.*, cashbook_module.*, stock_data.* , supplier_tran.* from purchase_module LEFT JOIN purchase_tran ON purchase_module.purchase_id = purchase_tran.purchase_cnct_id LEFT JOIN cashbook_module on purchase_module.purchase_id = cashbook_module.cash_pur_cnct_id LEFT JOIN supplier_tran on purchase_module.purchase_id = supplier_tran.sup_tran_pur_cnct_id LEFT JOIN stock_data on purchase_module.purchase_id = stock_data.pur_cnct_id WHERE purchase_id = ? or purchase_pay_out_id = ? ;";
  db.query(q, [req.params.purchaseId, req.params.purchaseId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("DELETED SUCCESSFULLY");
  });
};

export const addPurchasePayment = (req, res) => {
  const q1 =
    "INSERT INTO purchase_module (`purchase_prefix` , `purchase_prefix_no` , `purchase_name` , `purchase_date` , `sup_cnct_id` , `purchase_amt_type` ,  `purchase_amt_paid` , `purchase_pay_out_id` , `purchase_pay_out_prefix` , `purchase_pay_out_prefix_no` , `purchase_acc_id`  ) VALUES(?)";
  const values1 = [
    req.body.purchase_prefix,
    req.body.purchase_prefix_no,
    req.body.purchase_name,
    req.body.purchase_amt_out_date,
    req.body.purchase_sup_cnct_id,
    req.body.purchase_amt_out_mode,
    req.body.purchase_amt_out,
    req.body.purchase_cnct_id,
    req.body.purchase_pay_out_prefix,
    req.body.purchase_pay_out_prefix_no,
    req.body.purchase_acc_id,
  ];
  db.query(q1, [values1], (err, data) => {
    if (err) return res.status(500).json(err);
    const id1 = data.insertId;

    const supData =
      "INSERT INTO supplier_tran(`sup_tran_pay`,`sup_tran_date`,`sup_tran_cnct_id` , `sup_tran_pur_cnct_id`) VALUES (?)";
    const supValues = [
      req.body.purchase_amt_out,
      req.body.purchase_amt_out_date,
      req.body.purchase_sup_cnct_id,
      id1,
    ];
    db.query(supData, [supValues], (err, data) => {
      if (err) return res.status(500).json(err);
      const cashBookData =
        "INSERT INTO cashbook_module (`cash_pay`,`cash_mode`,`cash_date`, `cash_description` , `cash_pur_cnct_id`, `cash_acc_id`) VALUES (?)";
      const cashBookValues = [
        req.body.purchase_amt_out,
        req.body.purchase_amt_out_mode,
        req.body.purchase_amt_out_date,
        req.body.purchase_desc,
        id1,
        req.body.purchase_acc_id,
      ];
      db.query(cashBookData, [cashBookValues], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("INSERTED SUCCESSFULLY");
      });
    });
  });
};



export const fetchPurchasePayPrefixData = (req, res) => {
  const q =
    "select max(purchase_pay_out_prefix_no) as purchase_pay_out_prefix_no from purchase_module where purchase_acc_id = ?;";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const invoiceItemList = (req, res) => {
  const q1 =
    "SELECT distinct purchase_item_cnct_id , purchase_item_name , '0' as deleted ,  purchase_item_qty  ,purchase_item_price FROM accbook1.purchase_tran WHERE purchase_cnct_id = ? union SELECT distinct purchase_item_cnct_id , purchase_item_name , '1' as deleted ,  purchase_item_qty  ,purchase_item_price FROM accbook1.purchase_tran WHERE purchase_cnct_id = ? and purchase_item_cnct_id NOT IN (SELECT product_id FROM product_module ) union SELECT product_id , product_name , '0' as deleted , qty , purchase_price FROM product_module WHERE acc_id = ? and product_id NOT IN (SELECT purchase_item_cnct_id FROM purchase_tran WHERE purchase_cnct_id = ?);";
  db.query(
    q1,
    [
      req.params.purchaseId,
      req.params.purchaseId,
      req.params.accId,
      req.params.purchaseId,
    ],
    (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    }
  );
  // });
};

export const fetchFirstPayOutId = (req, res) => {
  const q =
    "SELECT * FROM accbook1.purchase_module where purchase_pay_out_id = ? limit 1;";
  db.query(q, req.params.purchasePayOutId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

//////////////  Update partially paid purchase invoice /////////////



export const updatePurchase = (req, res) => {
  const cashQuery =
    "UPDATE cashbook_module SET cash_pay = ? ,cash_mode = ? , cash_date = ? WHERE cash_pur_cnct_id = ?";
  const cashData = [
    req.body.purchase_amt_paid,
    req.body.purchase_amt_type,
    req.body.purchase_date,
    req.body.purchase_id,
  ];
  console.log("cashData : ", cashData);
  db.query(cashQuery, cashData, (err, data) => {
    if (err) return res.status(500).json(err);
    const supQuery =
      "UPDATE supplier_tran SET sup_tran_pay = ?, sup_tran_date = ? WHERE sup_tran_pur_cnct_id = ?";
    const supData = [
      req.body.purchase_amt_paid,
      req.body.purchase_date,
      req.body.purchase_id,
    ];
    console.log(" supData : ", supData);
    db.query(supQuery, supData, (err, data) => {
      if (err) return res.status(500).json(err);

      const purPayoutQuery =
        "UPDATE purchase_module SET purchase_amt_paid = ?, purchase_amt_type = ? WHERE purchase_id = ?";
      const purPayoutData = [
        req.body.purchase_amt_paid,
        req.body.purchase_amt_type,
        req.body.purchase_id,
      ];
      console.log(" purPayoutData : ", purPayoutData);
      db.query(purPayoutQuery, purPayoutData, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Updated Successfully");
      });
    });
  });
};

//////////////  Update unpaid purchase invoice  /////////////

export const updatePurchaseUnpaidTran = (req, res) => {
  const purData = [
    req.body.purchase_amt,
    req.body.purchase_date,
    req.body.purchase_amt_paid,
    req.body.purchase_amt_due,
    req.body.purchase_amt_type,
    req.body.purchase_id,
  ];

  const purQuery =
    "UPDATE purchase_module SET purchase_amt = ? ,purchase_date = ? ,purchase_amt_paid = ? ,purchase_amt_due = ? ,purchase_amt_type = ?  WHERE purchase_id = ?";
  db.query(purQuery, purData, (err, data) => {
    console.log(purData);
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};

export const addPurchasePayOutTran = (req, res) => {
  const q1 =
    "INSERT INTO purchase_module (`purchase_prefix` , `purchase_prefix_no` , `purchase_name` , `purchase_date` , `sup_cnct_id` , `purchase_amt_type` ,  `purchase_amt_paid` , `purchase_pay_out_id` , `purchase_pay_out_prefix` , `purchase_pay_out_prefix_no`  ) VALUES(?)";
  const values1 = [
    req.body.purchase_prefix,
    req.body.purchase_prefix_no,
    req.body.purchase_name,
    req.body.purchase_date,
    req.body.sup_cnct_id,
    req.body.purchase_amt_type,
    req.body.purchase_amt_paid,
    req.body.purchase_id,
    req.body.payment_out_prefix,
    req.body.payment_out_prefix_no,
  ];
  console.log("req.body : ", req.body, values1);
  db.query(q1, [values1], (err, data) => {
    if (err) return res.status(500).json(err);
    let id2 = data.insertId;
    const supData =
      "INSERT INTO supplier_tran(`sup_tran_pay`,`sup_tran_date`,`sup_tran_cnct_id`, `sup_tran_pur_cnct_id`) VALUES (?)";
    const supValues = [
      req.body.purchase_amt_paid,
      req.body.purchase_date,
      req.body.sup_cnct_id,
      //req.body.purchase_payOut_Id,
      id2,
    ];
    db.query(supData, [supValues], (err, data) => {
      if (err) return res.status(500).json(err);

      if (req.body.purchase_desc === "PAYMENT OUT") {
        const cashBookData =
          "INSERT INTO cashbook_module (`cash_pay`,`cash_mode`,`cash_date`, `cash_description` , `cash_pur_cnct_id`) VALUES (?)";
        const cashBookValues = [
          req.body.purchase_amt_paid,
          req.body.purchase_amt_type,
          req.body.purchase_date,
          req.body.purchase_desc,
          //req.body.purchase_payOut_Id,
          id2,
        ];
        db.query(cashBookData, [cashBookValues], (err, data) => {
          if (err) return res.status(500).json(err);
        });
      }
    });
  });
};

export const insertPurchaseUserAddedItemList = (req, res) => {
  const q2 =
    "INSERT INTO purchase_tran ( `purchase_cnct_id`, `purchase_item_name`, `purchase_item_qty`, `purchase_item_price`, `purchase_item_code` ,`purchase_item_unit` , `purchase_item_disc_unit` , `purchase_item_disc_val` , `purchase_item_disc_price` , `purchase_item_gst` , `purchase_item_gst_amt` , purchase_item_cnct_id) Values ?";
  const values2 = req.body.invoiceItemsList.map((values) => [
    req.params.purchaseId,
    values.in_items,
    values.in_qty,
    values.in_purchase_price,
    values.in_hsn_sac,
    values.in_unit,
    values.in_discount_unit,
    values.in_discount_value,
    values.in_discount_price,
    values.in_gst_prectentage,
    values.in_gst_amt,
    values.in_id,
  ]);

  db.query(q2, [values2], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};

export const deletePurchaseUserAddedItemList = (req, res) => {
  const q = "DELETE from purchase_tran where purchase_tran_id = ?";
  db.query(q, req.params.purTranId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const delPayOut = (req, res) => {
  const q =
    "DELETE purchase_module.* , cashbook_module.* , supplier_tran.* from purchase_module LEFT JOIN cashbook_module on purchase_module.purchase_id = cashbook_module.cash_pur_cnct_id LEFT JOIN supplier_tran on purchase_module.purchase_id = supplier_tran.sup_tran_pur_cnct_id where purchase_id = ? or purchase_pay_out_id = ? ;";
  db.query(q, [req.params.purchaseId, req.params.purchaseId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("DELETED SUCCESSFULLY");
  });
};

export const delPurchaseReturn = (req, res) => {
  const q =
    "DELETE purchase_module.* , cashbook_module.* , stock_data.*, service_tran.* , customer_tran.* from purchase_module LEFT JOIN cashbook_module on purchase_module.purchase_id = cashbook_module.cash_pur_cnct_id LEFT JOIN LEFT JOIN supplier_tran on purchase_module.purchase_id = supplier_tran.sup_tran_pur_cnct_id LEFT JOIN stock_data on purchase_module.purchase_id = stock_data.pur_cnct_id WHERE purchase_id = ? ;";
  db.query(q, [req.params.purchaseId, req.params.purchaseId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("DELETED SUCCESSFULLY");
  });
};

export const returnPurchase = (req, res) => {
  //console.log(req.body);

  // const q2 =
  //   "INSERT INTO purchase_tran (`purchase_tax`, `purchase_cnct_id`, `purchase_item_name`, `purchase_item_qty`, `purchase_item_price`, `purchase_item_code` ,`purchase_item_unit` , `purchase_item_disc_unit` , `purchase_item_disc_val` , `purchase_item_disc_price` , `purchase_item_gst` , `purchase_item_gst_amt` , purchase_item_cnct_id) Values ?";
  // const values2 = req.body.invoiceItemsList.map((values) => [
  //   values.in_tax,
  //   req.body.purchase_id,
  //   values.in_items,
  //   values.in_qty,
  //   values.in_purchase_price,
  //   values.in_hsn_sac,
  //   values.in_unit,
  //   values.in_discount_unit,
  //   values.in_discount_value,
  //   values.in_discount_price,
  //   values.in_gst_prectentage,
  //   values.in_gst_amt,
  //   values.in_id,
  // ]);

  // db.query(q2, [values2], (err, data) => {
  //   if (err) return res.status(500).json(err);

  let id2 = 0;

  //if (req.body.purchase_amt_type !== "unpaid") {
    const q1 =
      "INSERT INTO purchase_module (`purchase_prefix` , `purchase_prefix_no` , `purchase_name` , `purchase_date` , `sup_cnct_id` , `purchase_amt_type` ,  `purchase_amt_paid` , `purchase_re_id` , `purchase_re_prefix` , `purchase_re_prefix_no` , `purchase_acc_id`  ) VALUES(?)";
    const values1 = [
      req.body.purchase_prefix,
      req.body.purchase_prefix_no,
      req.body.purchase_name,
      req.body.purchase_date,
      req.body.sup_cnct_id,
      req.body.purchase_amt_type,
      req.body.purchase_refund_amt,
      req.body.purchase_id,
      req.body.purchase_re_prefix,
      req.body.purchase_re_prefix_no,
      req.body.purchase_acc_id,
    ];
    db.query(q1, [values1], (err, data) => {
      if (err) return res.status(500).json(err);
      id2 = data.insertId;

      const q3 =
        "INSERT INTO stock_data (`product_stock_out` ,`primary_unit`, `sale_price`,`entry_date`,`cnct_id`,`selected_unit` , `pur_cnct_id`) VALUES ?";

      const values3 = req.body.invoiceItemsList.map((item) => [
        item.purchase_item_qty,
        item.purchase_item_unit,
        item.purchase_item_price,
        req.body.purchase_date,
        item.purchase_item_cnct_id,
        item.purchase_item_unit,
        id2,
      ]);

      db.query(q3, [values3], (err, data) => {
        if (err) return res.status(500).json(err);

        const supData =
          "INSERT INTO supplier_tran(`sup_tran_receive`,`sup_tran_date`,`sup_tran_cnct_id`, `sup_tran_pur_cnct_id`) VALUES (?)";
        const supValues = [
          req.body.purchase_refund_amt,
          req.body.purchase_date,
          req.body.sup_cnct_id,
          id2,
        ];
        db.query(supData, [supValues], (err, data) => {
          if (err) return res.status(500).json(err);

          if (req.body.purchase_desc === "PAYMENT IN") {
            const cashBookData =
              "INSERT INTO cashbook_module (`cash_receive`,`cash_mode`,`cash_date`, `cash_description` , `cash_pur_cnct_id` ,`cash_acc_id`) VALUES (?)";
            const cashBookValues = [
              req.body.purchase_refund_amt,
              req.body.purchase_amt_type,
              req.body.purchase_date,
              //req.body.purchase_desc,
              "PAYMENT IN",
              id2,
              req.body.purchase_acc_id,
            ];
            db.query(cashBookData, [cashBookValues], (err, data) => {
              if (err) return res.status(500).json(err);
              return res.status(200).json("Transaction has been Entered");
            });
          }
        });
      });
    });
  // } else {
  //   return res.status(200).json("Transaction has been Entered");
  // }

  //});
};

export const fetchPurchaseReturnPrefixData = (req, res) => {
  const q =
    "select max(CAST(purchase_re_prefix_no  as SIGNED) ) as purchase_re_prefix_no from purchase_module where purchase_acc_id = ?;";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
