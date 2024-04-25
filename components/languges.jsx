/** @format */

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

const LangNav = [
  { id: 1, lable: "Python", name: "Python", icon: "/assets/icons/python.svg" },
  { id: 2, lable: "Node JS", name: "Node JS", icon: "/assets/icons/nodejs.svg" },
  { id: 3, lable: "C#", name: "C#", icon: "/assets/icons/c_sharp.svg" },
  { id:4,  lable: "PHP", name:"PHP", icon:"/assets/images/php.png"}
]

const Languages = ({ onClickLanguage }) => {
  
  const [btnToggle, setBtnToggle] = useState(1)
  return (
    <div className="flex justify-start items-center gap-x-8 md:gap-x-32 my-4">
      {LangNav.map(({ id, lable, name, icon }) => (
        <div className={`flex flex-col items-center cursor-pointer ${btnToggle === id && 'border-b-2 border-lime-500'} `} onClick={() =>
        {
          onClickLanguage(name)
          setBtnToggle(id)
         }}>
            <Image
              src={icon}
              alt="logo"
              width={30}
              height={30}
              className="object-contain"
            />
            <h3 className="max-sm:hidden font-satoshi font-semibold">{lable}</h3>
          </div>
      ))}
    </div>
  );
};

export default Languages;
