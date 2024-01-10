import { db } from "../connect.js";

export const verifyAdmin = (req, res) => {
  const q = "SELECT * from admin_login where super_email = ?  ";
  db.query(q, [req.params.email ], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetch = (req, res) => {
  const q = "SELECT business_account.* , login_module.log_email from business_account LEFT JOIN login_module ON login_module.log_id = business_account.user_id ; ";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const restrictAcc = (req, res) => {
  const q = "UPDATE business_account SET access = ? where business_id = ?";
  db.query(q, [req.body.restrict, req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const unrestrictAcc = (req, res) => {
  const q = "UPDATE business_account SET access = ? where business_id = ?";
  db.query(q, [req.body.unrestrict, req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};



export const addPayPLan = (req, res) => {
  const q =
    "INSERT into payment_plan_module (`plan_dur`,`plan_price`) VALUES(?)";
  const values = [req.body.plan_dur, req.body.plan_amt];
  console.log("values : ", values);
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("INSERTED SUCCESSFULLY");
  });
};

export const fetchPayPlan = (req, res) => {
  const q = "SELECT * from payment_plan_module ";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const delPayPLan = (req, res) => {
  const q = "DELETE from payment_plan_module where plan_id = ?";
  db.query(q, [req.params.planId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const updatePayPLan = (req, res) => {
  const q =
    "UPDATE payment_plan_module SET plan_dur = ? , plan_price = ? WHERE plan_id = ?";
  const values = [req.body.plan_dur, req.body.plan_price, req.body.plan_id];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};

export const addCoupon = (req, res) => {
  const q =
    "INSERT into offer_code_module (`code_name`,`code_value`, `code_type`) VALUES(?)";
  const values = [req.body.offer_code, req.body.offer_value , req.body.offer_type];
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("INSERTED SUCCESSFULLY");
  });
};

export const fetchCoupon = (req, res) => {
  const q = "SELECT * from offer_code_module ";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const delCoupon = (req, res) => {
  const q = "DELETE from offer_code_module where code_id = ?";
  db.query(q, [req.params.codeId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
}

export const updateCoupon = (req, res) => {
  const q =
    "UPDATE offer_code_module SET offer_code = ? , offer_value = ? , offer_type = ?  WHERE code_id = ?";
  const values = [req.body.offer_code, req.body.offer_value, req.body.offer_type , req.body.code_id];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};


export const fetchHsnCodes = (req, res) => {
  const q = "SELECT * from convertcsv ";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchHsnCodeById = (req, res) => {
  const q = "SELECT * from convertcsv where id = ?";
  db.query(q, [req.params.hsnId] , (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addHsnCode = (req, res) => {
  const q =
    "INSERT into convertcsv (`hsn_code`,`hsn_desc`, `cgst`, `sgst` , `igst` , `cess`) VALUES(?)";
  const values = [req.body.hsn_code, req.body.hsn_desc, req.body.hsn_gst/2, req.body.hsn_gst/2, req.body.hsn_gst, req.body.hsn_cess] ;
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("INSERTED SUCCESSFULLY");
  });
};

export const updateHsnCode = (req, res) => {
  const q =
    "UPDATE convertcsv SET hsn_code = ? , hsn_desc = ?, cgst = ?, sgst = ?, igst = ?, cess = ?  WHERE id = ?";
  const values = [req.body.hsn_code, req.body.hsn_desc, req.body.hsn_gst/2 , req.body.hsn_gst/2 , req.body.hsn_gst , req.body.cess , req.params.hsnId];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};


export const delHsnCode = (req, res) => {
  const q = "DELETE from convertcsv where id = ?";
  const values = req.params.hsnId;
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Deleted Successfully");
  });
};




export const fetchSacCodes = (req, res) => {
  const q = "SELECT * from sac";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchSacCodeById = (req, res) => {
  const q = "SELECT * from sac where id = ?";
  db.query(q, [req.params.sacId] , (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const addSacCode = (req, res) => {
  const q =
    "INSERT into sac (`sac_code`,`sac_desc` , `sac_igst` ) VALUES(?)";
  const values = [req.body.sac_code, req.body.sac_desc, req.body.sac_gst] ;
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("INSERTED SUCCESSFULLY");
  });
};


export const updateSacCode = (req, res) => {
  const q =
    "UPDATE sac SET sac_code = ? , sac_desc = ? , sac_igst = ?  WHERE id = ?";
  const values = [req.body.sac_code, req.body.sac_desc, req.body.sac_gst , req.params.sacId];
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};


export const delSacCode = (req, res) => {
  const q = "DELETE from sac where id = ?";
  const values = req.params.sacId;
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Deleted Successfully");
  });
};