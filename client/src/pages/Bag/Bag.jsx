import Navbar1 from "../../components/Navbars/Navbar1";
import Navbar2 from "../../components/Navbars/Navbar2";
import Navbar3 from "../../components/Navbars/Navbar3";
import ItemCard from "../Components/ItemCard";
import Footer from "../../components/Footer";  
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Loader from "./Loader.jsx";

const baseURL = process.env.REACT_APP_BASE_API_URL;

function Bag() {

  const navigate = useNavigate();
  const token = Cookies.get('auth_token');
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  const [data, setData] = useState([]);
  useEffect(() => {

    const fetchData = async () =>{
      try {
        const token = Cookies.get('auth_token');
        const response = await axios.get(`${baseURL}/api/user/checkout`, {
          headers : {
            "content-type" : "application/json",
            Authorization : `Bearer ${token}`,
          },
        });
        setData(response.data.bag);
        console.log("Successfully fetched checkout data.");
      } catch (error) {
        console.log("Error : ", error);
      }
    }

    fetchData();
}, []);

    const [subTotal, setSubtotal] = useState(0);
    useEffect(() => {
      const subtotalAmount = data.reduce((acc, item) => acc + parseInt(item.price), 0);
      setSubtotal(subtotalAmount);
    }, [data]);

    const DeliveryCharge = 1250;
    const Total = subTotal + DeliveryCharge;

    const handleCheckOut = async () => {
      try {
        await axios.post(`${baseURL}/api/user/order`, {userId}, {
          headers : {
            "content-type" : "application/json",
            Authorization : `Bearer ${token}`,
          },
        });
        console.log("Order placed Successfully");
        navigate("/orderPlaced");
      } catch (error) {
        console.log("Error : ", error);
      }
    }

  return (
    <div>
      <Navbar1 />
      <Navbar2 />
      <Navbar3 />

      {!data ? (<Loader />) 
       : (
        <>
          <div className="flex justify-center items-center mt-10 mb-14 w-[90%] mx-auto gap-10 md:flex-col">
            <div className="flex flex-col space-y-6 ">
                <p className="text-2xl w-full">Bag</p>
                <div className="self-start md:max-w-full">
                  {
                    data.map((item,index) => <ItemCard key={index} imgLink={item.imgLink} name={item.name} type={item.type} price={item.price} userSize={item.userSize} />)
                  }
                </div>
            </div>
              

            <div className="self-start w-[350px] space-y-6 md:w-full">
              <p className="text-3xl w-full">Summary</p>
              <div className="space-y-2 font-medium text-slate-900">
                <p className="flex justify-between"><span>Subtotal</span> <span>₹ {subTotal}</span></p>
                <p className="flex justify-between"><span>Estimated Delivery</span> <span>₹ {DeliveryCharge}</span></p>
              </div>

              <div className="space-y-4">
                <div className="h-[1.5px] bg-slate-200"></div>
                <p className="flex justify-between"><span>Total</span> <span>₹ {Total}</span></p>
                <div className="h-[1.5px] bg-slate-200"></div>
              </div>

              <div>
              <button onClick={handleCheckOut} className="w-full px-9 py-3 rounded-3xl font-semibold bg-black text-white sm:px-4  sm:text-sm hover:bg-gray-800 ">Checkout</button>
              </div>

            </div>

          </div>
        </>
          ) }
      <Footer />
    </div>
  );
}

export default Bag;
