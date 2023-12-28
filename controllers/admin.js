import { db } from "../connect.js";

export const fetch = (req, res) => {
  const q = "SELECT * from business_account ";
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


export const addPayPLan = (req, res) => {
  const q =
    "INSERT into payment_plan_module (`plan_dur`,`plan_price`) VALUES(?)";
  const values = [req.body.plan_dur, req.body.plan_price];
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


