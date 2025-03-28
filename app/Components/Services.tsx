import React from "react";

const Services = () => {
  return (
    <div className="flex flex-col items-center center min-h-screen bg-card ">
      <h2 className="text-4xl font-bold  mb-8 text-center">Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div
          className=" p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 text-center border-2"
          role="article"
        >
          <h3 className="text-xl font-semibold mb-2">Report Incidents Instantly</h3>
          <p className= "">
            Instantly report security incidents as they happen. View live updates from users on the ground.
          </p>
        </div>
        <div
          className=" p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 text-center border-2">
      <h3 className="text-xl font-semibold mb-2">Real-Time Security Alerts</h3>
          <p className="-600">
            Receive real-time alerts about nearby security threats based on your location.
          </p>
        </div>
        <div
          className=" p-6 rounded-2xl shadow-md hover:shadow-lg transition transform hover:scale-105 text-center border-2"
          role="article"
        >
          <h3 className="text-xl font-semibold  mb-2">Community Engagement</h3>
          <p className="">
            Engage with a network of users committed to safety. Contribute to a crowdsourced security database.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Services;