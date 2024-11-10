import React, { useEffect, useRef, useState } from "react";

const SeriesCreatePage = () => {
  // const name = useRef<HTMLInputElement>(null);
  // const age = useRef<HTMLInputElement>(null);
  // const selectRef = useRef<HTMLSelectElement>(null);
  // const [isDisabled, setIsDisabled] = useState(true);
  // const [pcls, setpcls] = useState<Pcl[]>([]);

  // const checkDisabledState = () => {
  //   const nameValue = name.current?.value;
  //   const ageValue = age.current?.value;

  //   // Disable the button if either field is empty
  //   if (nameValue && ageValue) {
  //     setIsDisabled(false);
  //   } else {
  //     setIsDisabled(true);
  //   }
  // };

  // useEffect(() => {
  //   getAllPcls();
  //   // Add event listeners to input fields
  //   const nameInput = name.current;
  //   const ageInput = age.current;

  //   nameInput?.addEventListener("input", checkDisabledState);
  //   ageInput?.addEventListener("input", checkDisabledState);

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     nameInput?.removeEventListener("input", checkDisabledState);
  //     ageInput?.removeEventListener("input", checkDisabledState);
  //   };
  // }, []);

  // const handleClick = async () => {
  //   if (isDisabled) return;
  //   // Handle form submission
  //   const vlaueName = name.current?.value as string;
  //   const valueAge = age.current?.value as string;
  //   const valuePclCd = selectRef.current?.value as string;
  //   const res = await createSeriesApi({
  //     name: vlaueName,
  //     age: Number(valueAge),
  //     pcl_cd: valuePclCd,
  //   });
  //   if (res.message === "suceess") {
  //     console.log("success", seriesData);
  //     clearFields();
  //   }
  // };

  // const clearFields = () => {
  //   if (name.current) name.current.value = ""; // Clear name field
  //   if (age.current) age.current.value = "";
  // };

  // const getAllPcls = async () => {
  //   const newPcls: Pcl[] = await getAllPclsApi();
  //   setpcls(newPcls);
  // };

  return (
    <div>
      {/* <input ref={name} placeholder="Enter name" />
      <input type="number" ref={age} placeholder="Enter age" />
      <select ref={selectRef}>
        {pcls.length &&
          pcls.map((pcl, i) => (
            <option value={pcl.cd} key={"pcl-option-seriescreate-" + i}>
              {pcl.name}
            </option>
          ))}
      </select>
      <button
        style={isDisabled ? { color: "lightgrey" } : { color: "black" }}
        onClick={handleClick}
        disabled={isDisabled}
      >
        提出
      </button> */}
    </div>
  );
};

export default SeriesCreatePage;
