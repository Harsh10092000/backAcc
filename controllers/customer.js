import { db } from "../connect.js";

export const sendData = (req, res) => {
  const q = "SELECT * from customer_module where cust_number = ? and cust_acc_id = ?";
  db.query(q, [req.body.cust_number , req.body.cust_acc_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User Already Exists");
    console.log("req.body : " , req.body)
    const q =
      "INSERT INTO customer_module (`cust_name`,`cust_number`,`cust_amt`,`amt_type`,`cust_gstin`,`cust_sflat`,`cust_sarea`,`cust_spin`,`cust_scity`,`cust_sstate`,`cust_bflat`,`cust_barea`,`cust_bpin`,`cust_bcity`,`cust_bstate`, `cust_acc_id`) Values (?)";
    const values = [
      req.body.cust_name,
      req.body.cust_number,
      req.body.cust_amt,
      req.body.amt_type,
      req.body.cust_gstin,
      req.body.cust_sflat,
      req.body.cust_sarea,
      req.body.cust_spin,
      req.body.cust_scity,
      req.body.cust_sstate,
      req.body.cust_bflat,
      req.body.cust_barea,
      req.body.cust_bpin,
      req.body.cust_bcity,
      req.body.cust_bstate, 
      req.body.cust_acc_id,
    ];
    
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      const id = data.insertId;
      const values2 = [
        req.body.cust_amt,
        req.body.cust_date,
        id
      ];

      if(req.body.amt_type === 'receive') {
        
      const q =
        "INSERT INTO customer_tran(`tran_receive`,`tran_date`,`cnct_id`) VALUES(?)";
        db.query(q, [values2], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Data has been entered");
        });
      } else {
        
        const q =
        "INSERT INTO customer_tran(`tran_pay`,`tran_date`,`cnct_id`) VALUES(?)";
        db.query(q, [values2], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Data has been entered");
        });
      }
    });
  });
};


export const fetchData = (req, res) => {
  //const q = "select customer_module.*, sum(IFNULL(customer_tran.tran_pay,0)) - sum(IFNULL(customer_tran.tran_receive,0)) as cust_total_amt from customer_tran LEFT JOIN customer_module ON customer_tran.cnct_id = customer_module.cust_id where customer_module.cust_acc_id = ? group by customer_tran.cnct_id ;";
  const q = "SELECT customer_module.*, SUM(IFNULL(customer_tran.tran_pay, 0)) - SUM(IFNULL(customer_tran.tran_receive, 0)) AS cust_total_amt FROM customer_module LEFT JOIN customer_tran ON customer_tran.cnct_id = customer_module.cust_id WHERE customer_module.cust_acc_id = ? GROUP BY customer_module.cust_id ; "
  db.query(q, [req.params.accId] , (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};



export const fetchTran = (req, res) => {
  const q = "SELECT * from customer_tran where cnct_id = ? order by tran_id DESC";
  const values = req.params.id;
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
export const fetchAll = (req, res) => {
  const q = "SELECT * from customer_tran";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchTotal = (req, res) => {
  console.log(req.params.accId)
  const q = `SELECT sum(customer_tran.tran_pay) as payTotal , sum(customer_tran.tran_receive) as receiveTotal FROM customer_module left join customer_tran on customer_tran.cnct_id =  customer_module.cust_id  where cust_acc_id = ? group by customer_module.cust_acc_id;`
  db.query(q, [req.params.accId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  })
};





export const fetchLastTran = (req, res) => {
  const q =
    "SELECT * from customer_tran where cnct_id = ? ORDER BY tran_id DESC LIMIT 1";
  const values = req.params.cnct_id;
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const deleteCustomer = (req, res) => {
  const q =
    "DELETE customer_module.*,customer_tran.* from customer_module LEFT JOIN customer_tran ON customer_module.cust_id = customer_tran.cnct_id where cust_id = ?";
  db.query(q, [req.params.userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Deleted SuccessFully");
  });
};

export const updateCustomer = (req, res) => {
  const q =
    "UPDATE customer_module SET cust_name = ?,cust_number = ?,cust_amt = ?,amt_type = ?,cust_gstin = ? , cust_sflat = ? , cust_sarea= ?, cust_spin= ?,cust_scity=?,cust_sstate= ?,cust_bflat = ? , cust_barea=?,cust_bpin = ? , cust_bcity = ? , cust_bstate= ?   WHERE cust_id = ?";
  const values = [
    req.body.cust_name,
    req.body.cust_number,
    req.body.cust_amt,
    req.body.amt_type,
    req.body.cust_gstin,
    req.body.cust_sflat,
    req.body.cust_sarea,
    req.body.cust_spin,
    req.body.cust_scity,
    req.body.cust_sstate,
    req.body.cust_bflat,
    req.body.cust_barea,
    req.body.cust_bpin,
    req.body.cust_bcity,
    req.body.cust_bstate,
    req.params.custid,
  ];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};

export const fetchCustomerData = (req, res) => {
  const q = "SELECT * from customer_module WHERE cust_id = ? ";
  db.query(q, req.params.custId, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchDataUsingId = (req, res) => {
  const q = "SELECT * from customer_module where cust_id = ?";
  const cust_id = req.params.user_id;
  db.query(q, cust_id, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
export const deleteTran = (req, res) => {
  const q = "DELETE from customer_tran where tran_id = ?";
  const values = req.params.tran_id;
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Deleted Successfully");
  });
};



export const fetchTranid = (req, res) => {
  const q = "SELECT * from customer_tran where tran_id = ?";
  const values = req.params.tid;
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
