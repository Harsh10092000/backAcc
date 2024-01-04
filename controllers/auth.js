import { transporter } from "../nodemailer.js";
import { db } from "../connect.js";
export const sendOtp = (req, res) => {
  var otp = Math.floor(100000 + Math.random() * 900000);
  const info = {
    from: '"Foo Faa 👻" <rakshita.mathexpert@gmail.com>', // sender address
    to: req.params.email, // list of receivers
    subject: "Hello ✔", // Subject line
    html: `Otp is <b>${otp}</b> and you can use this to login into our system`, // html body
  };
  transporter.sendMail(info, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(otp);
  });
};






export const login = (req, res) => {
  const q = "SELECT * from login_module WHERE log_email = ?";
  db.query(q, req.body.inputs, (err, data) => {
    if (err) return res.status(500).json(err);
    console.log("data : " , data);
    if (data.length > 0) {
    if (data[0].log_user === 1) {
      const UserQuery = "select login_module.* , business_account.business_id , business_account.business_id ,business_account.access from login_module left join business_account on login_module.log_id = business_account.user_id where log_user = 1 and log_email = ? order by access desc;"
      db.query(UserQuery, req.body.inputs, (err, data) => {
        console.log("data : " , data);
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
    } else {
      //const staffQuery = "select login_module.* , staff_parties, staff_bills, staff_inventory, staff_module.staff_user_id, staff_module.staff_acc_id as business_id from login_module left join staff_module on login_module.log_id = staff_module.staff_user_id where log_user = 0 and log_email = ? ;"
      const staffQuery = "select login_module.* , staff_parties, staff_bills, staff_inventory, staff_module.staff_user_id, staff_module.staff_acc_id as business_id , business_account.access from login_module left join staff_module on login_module.log_id = staff_module.staff_user_id left join business_account on staff_module.staff_acc_id = business_account.business_id where log_user = 0 and log_email = ?;"
      db.query(staffQuery, req.body.inputs, (err, data) => {
        console.log("data : " , data);
        if (err) return res.status(500).json(err);  
        return res.status(200).json(data);
      });
    } 
  } else {
    const q = "INSERT INTO login_module (log_email , log_user) Value (?)";
    const values1 = [
      req.body.inputs, 
      "1",
    ]
      db.query(q, [values1], (err, data) => {
        if (err) return res.status(500).json(err);
        const q = "SELECT * from login_module WHERE log_id = ?";
        db.query(q, data.insertId, (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json(data);
        });
      });
  }
  });
};


