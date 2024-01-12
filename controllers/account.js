import { db } from "../connect.js";

// export const sendData = (req, res) => {
//   const q =
//     "INSERT into business_account (`business_name`,`business_address`,`business_gst`,`business_type`,`business_nature`, `user_id`) VALUES(?)";
//   const values = [
//     req.body.business_name,
//     req.body.business_address,
//     req.body.business_gst,
//     req.body.business_type,
//     req.body.business_nature,
//     req.body.user_id,
//   ];
//   db.query(q, [values], (err, data) => {
//     if (err) return res.status(500).json(err);
//     return res.status(200).json("INSERTED SUCCESSFULLY");
//   });
// };

export const fetch = (req, res) => {
  const q = "SELECT * from business_account where user_id = ? ";
  db.query(q, [req.params.uId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchAccessData = (req, res) => {
  const q = "SELECT access from business_account where business_id = ? ";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// export const updateAccData = (req, res) => {
//   const q =
//     "UPDATE business_account SET business_name = ? , business_address = ?, business_gst = ?, business_type = ?, business_nature = ? , business_logo = ? , business_signature = ?, business_bank_acc = ?, business_acc_no = ?, business_ifsc_code = ?, business_payee_name = ? WHERE business_id = ?";
//     console.log(req.body)
//     const values = [
//     req.body.business_name,
//     req.body.business_address,
//     req.body.business_gst,
//     req.body.business_type,
//     req.body.business_nature,
//     req.body.business_logo,
//     req.body.business_signature,
//     req.body.business_bank_acc,
//     req.body.business_acc_no,
//     req.body.business_ifsc_code,
//     req.body.business_payee_name,
//     req.body.business_id,
//   ];
//   db.query(q, values, (err, data) => {
//     if (err) return res.status(500).json(err);
//     return res.status(200).json("Updated Successfully");
//   });
// };


export const fetchData = (req, res) => {
  const q = "SELECT * from business_account where business_id = ? ";
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const checkAcc = (req, res) => {
  const q = "select user_id from business_account where user_id = ? union select staff_user_id from staff_module where staff_user_id = ?;";
  db.query(q, [req.params.uId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};



// export const delData = (req, res) => {
//   const q = "DELETE from business_account where business_id = ?";
//   const values = req.params.accId;
//   db.query(q, values, (err, data) => {
//     if (err) return res.status(500).json(err);
//     return res.status(200).json("Deleted Successfully");
//   });
// };

// const delAcc = (id, res) => {
//   const q = "DELETE business_account.* where business_id = ?";
//   db.query(q, id, (err, data) => {
//     if (err) return res.status(500).json(err); 
//   });
// };

const delAcc = (id, res) => {
  const q = "SELECT business_id from business_account where business_id = ? ";
  db.query(q, id, (err, accdata) => {
    if (err) return res.status(500).json(err);
    if (accdata.length < 1) return false;
    const q = "DELETE from business_account where business_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);
    });
  });
};


const delCust = (id, res) => {
  const q = "SELECT cust_id from customer_module where cust_acc_id = ? ";

  db.query(q, id, (err, custdata) => {
    if (err) return res.status(500).json(err);
    if (custdata.length < 1) return false;
    const q = "DELETE from customer_module where cust_acc_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);
      
      custdata.map((item) => {
        console.log(item.cust_id)
        const q = "DELETE from customer_tran where cnct_id = ?";
        db.query(q, item.cust_id, (err, data) => {
          if (err) return res.status(500).json(err);
        });
      });
    });
  });
};

const delSup = (id, res) => {
  const q = "SELECT sup_id from supplier_module where sup_acc_id = ? ";

  db.query(q, id, (err, supdata) => {
    if (err) return res.status(500).json(err);
    if (supdata.length < 1) return false;
    const q = "DELETE from supplier_module where sup_acc_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);

      supdata.map((item) => {
        const q = "DELETE from supplier_module where sup_tran_cnct_id = ?";
        db.query(q, item.sup_id, (err, data) => {
          if (err) return res.status(500).json(err);
        });
      });
    });
  });
};

const delPro = (id, res) => {
  const q = "SELECT product_id from product_module where acc_id = ? ";

  db.query(q, id, (err, prodata) => {
    if (err) return res.status(500).json(err);
    if (prodata.length < 1) return false;
    const q = "DELETE from product_module where acc_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);

      prodata.map((item) => {
        const q = "DELETE from stock_data where cnct_id = ?";
        db.query(q, item.product_id, (err, data) => {
          if (err) return res.status(500).json(err);
        });
      });
    });
  });
};

const delSer = (id, res) => {
  const q = "SELECT ser_id from service_module where ser_acc_id = ? ";
  db.query(q, id, (err, serdata) => {
    if (err) return res.status(500).json(err);
    if (serdata.length < 1) return false;
    const q = "DELETE from service_module where ser_acc_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);
      serdata.map((item) => {
        const q = "DELETE from service_tran where ser_cnct_id = ?";
        db.query(q, item.ser_id, (err, data) => {
          if (err) return res.status(500).json(err);
        });
      });
    });
  });
};

const delCash = (id, res) => {
  const q = "SELECT cash_id from cashbook_module where cash_acc_id = ? ";
  db.query(q, id, (err, cashdata) => {
    if (err) return res.status(500).json(err);
    if (cashdata.length < 1) return false;
    const q = "DELETE from cashbook_module where cash_acc_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);
    });
  });
};

const delExp = (id, res) => {
  // SELECT expenses_module
  const q = "SELECT exp_id from expenses_module where exp_acc_id = ? ";
  db.query(q, id, (err, expdata) => {
    if (err) return res.status(500).json(err);
    if (expdata.length < 1) return false;
    // Delete expenses_module
    const q = "DELETE from expenses_module where exp_acc_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);
      // Delete expense_category
      const q = "DELETE from expense_category where acc_id = ?";
      db.query(q, id, (err, data) => {
        if (err) return res.status(500).json(err);
        // Delete expense_list
        const q = "DELETE from expense_list where acc_id = ?";
        db.query(q, id, (err, data) => {
          if (err) return res.status(500).json(err);
          // Delete expenses_tran
          expdata.map((item) => {
            const q = "DELETE from expenses_tran where cnct_id = ?";
            db.query(q, item.exp_id, (err, data) => {
              if (err) return res.status(500).json(err);
            });
          });
        });
      });
    });
  });
};

const delSale = (id, res) => {
  const q = "SELECT sale_id from sale_module where sale_acc_id = ? ";
  db.query(q, id, (err, saledata) => {
    if (err) return res.status(500).json(err);
    if (saledata.length < 1) return false;
    const q = "DELETE from sale_module where sale_acc_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);
      saledata.map((item) => {
        const q = "DELETE from sale_tran where sale_cnct_id = ?";
        db.query(q, item.sale_id, (err, data) => {
          if (err) return res.status(500).json(err);
        });
      });
    });
  });
};


const delPur = (id, res) => {
  const q = "SELECT purchase_id from purchase_module where purchase_acc_id = ? ";
  db.query(q, id, (err, purdata) => {
    if (err) return res.status(500).json(err);
    if (purdata.length < 1) return false;
    const q = "DELETE from purchase_module where purchase_acc_id = ?";
    db.query(q, id, (err, data) => {
      if (err) return res.status(500).json(err);
      purdata.map((item) => {
        const q = "DELETE from purchase_tran where purchase_cnct_id = ?";
        db.query(q, item.purchase_id, (err, data) => {
          if (err) return res.status(500).json(err);
        });
      });
    });
  });
};


export const delData = (req, res) => {
  delCust(req.params.accId);
  delSup(req.params.accId);
  delPro(req.params.accId);
  delSer(req.params.accId);
  delCash(req.params.accId);
  delExp(req.params.accId);
  delSale(req.params.accId);
  delPur(req.params.accId);
  delAcc(req.params.accId);
  return res.status(200).json("Deleted Successfully");
};


export const fetchStaffData = (req, res) => {
  const q = "SELECT * from staff_module where staff_user_id = ? ";
  db.query(q, [req.params.uId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const newUserLoginData = (req, res) => {
  const UserQuery = "select login_module.* , business_account.business_id , business_account.access from login_module left join business_account on login_module.log_id = business_account.user_id where log_user = 1 and log_email = ? order by access desc;"
  db.query(UserQuery, req.params.email, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};



