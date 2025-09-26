// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import for navigation
// import { FiArrowLeft } from 'react-icons/fi';      // Import an icon
// import '../css//Payment.css';                             // Import the CSS file

// function Payment() {
//   const [amount, setAmount] = useState('');
//   const navigate = useNavigate(); // Initialize the navigate function

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (amount === "" || isNaN(amount)) {
//       alert("Please enter a valid amount");
//       return;
//     }
    
//     const options = {
//       key: "rzp_test_icvr4kCWLfbCok",
//       amount: amount * 100,
//       currency: "INR",
//       name: "Your Company Name",
//       description: "Test Transaction",
//       handler: function (response) {
//         alert("Payment ID: " + response.razorpay_payment_id);
//       },
//       prefill: {
//         name: "Your Name",
//         email: "youremail@example.com",
//         contact: "9999999999"
//       },
//       notes: {
//         address: "Your Company Address"
//       },
//       theme: {
//         color: "#007bff"
//       }
//     };
//     const pay = new window.Razorpay(options);
//     pay.open();
//   };

//   return (
//     <div className="payment-page">
//       {/* Return to Home Button */}
//       <button className="home-btn" onClick={() => navigate('/')}>
//         <FiArrowLeft size={20} />
//         Return to Home
//       </button>

//       <form className="payment-form" onSubmit={handleSubmit}>
//         <h2 className="payment-title">Secure Payment</h2>
        
//         <input 
//           type="text" 
//           placeholder='Enter Amount in INR' 
//           className="amount-input"
//           value={amount} 
//           onChange={(e) => setAmount(e.target.value)} 
//         />
        
//         <button type="submit" className="submit-btn">
//           Pay Now
//         </button>
//       </form>
//     </div>
//   );
// }

// export default Payment;