import { db } from "../connect.js";
import { transporter } from "../nodemailer.js";

export const fetch = (req, res) => {
  const q =
    "SELECT * from staff_module where staff_acc_id = ? and staff_owner_id = ?";
  db.query(q, [req.params.accId, req.params.uId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const fetchdataById = (req, res) => {
  const q = "SELECT * from staff_module where staff_id = ? ";
  db.query(q, [req.params.staffId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

// export const restrictAcc = (req, res) => {
//   console.log(req.params.id);
//   const q = "UPDATE business_account SET access = ? where business_id = ?";
//   db.query(q, [req.body.restrict ,req.params.id] ,(err, data) => {
//     if (err) return res.status(500).json(err);
//     return res.status(200).json(data);
//   });
// };

export const sendData = (req, res) => {
  const q1 = "INSERT INTO login_module (`log_email`, `log_user`) Value (?)";
  const values1 = [
    req.body.staff_email, 
    "0",
  ]
  db.query(q1, [values1], (err, data) => {
    if (err) return res.status(500).json(err);

    const q =
      "INSERT into staff_module (`staff_user_id`, `staff_name`,`staff_email`,`staff_parties`,`staff_inventory`,`staff_bills`, `staff_owner_id` , `staff_acc_id`) VALUES(?)";
    const values = [
      data.insertId,
      req.body.staff_name,
      req.body.staff_email,
      req.body.staff_parties,
      req.body.staff_inventory,
      req.body.staff_bills,
      req.body.staff_owner_id,
      req.body.staff_acc_id,
    ];
    console.log("values : ", values);
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("INSERTED SUCCESSFULLY");
    });
  });
};

export const updateData = (req, res) => {
  const q =
    "UPDATE staff_module SET staff_name = ?, staff_email = ? , staff_parties = ? ,staff_inventory = ? , staff_bills = ? WHERE staff_id = ?";
  const values = [
    req.body.staff_name,
    req.body.staff_email,
    req.body.staff_parties,
    req.body.staff_inventory,
    req.body.staff_bills,
    req.body.staff_id,
  ];
  console.log(values);
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Updated Successfully");
  });
};

export const delData = (req, res) => {
  const q = "DELETE from staff_module where staff_id = ?";
  db.query(q, [req.params.staffId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const sendOtp = (req, res) => {
  const q = "select log_email from login_module where log_email = ?";
  db.query(q, [req.params.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) {
      return res.status(200).json("Email Already Exists");
    } else {
      var otp = Math.floor(100000 + Math.random() * 900000);
      const info = {
        from: '"Foo Faa 👻" <rakshita.mathexpert@gmail.com>', // sender address
        to: req.params.email, // list of receivers
        subject: "Hello ✔", // Subject line
        html: `Otp is <b>${otp}</b> and you can use this to login into our system`, // html body
      };
      transporter.sendMail(info, (err, data) => {
        if (err) return res.status(500).json(err);
        console.log("data : ", data);
        return res.status(200).json(otp);
      });
    }
  });
};
