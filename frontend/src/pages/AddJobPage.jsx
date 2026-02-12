import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState(""); 
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
 const navigate = useNavigate();
 const [error, setError] = useState(null);
 const [isSubmitting, setIsSubmitting] = useState(false);

 
  const submitForm = async (e) =>
     {e.preventDefault();
    setError(null);
  
    if (
    !title ||
    !type ||
    !description ||
    !companyName ||
    !contactEmail ||
    !contactPhone ||
    !location ||
    !salary
  ) {
    setError("Please fill in all fields");
    return;
  }

   // 2) Convert + validate salary
  const salaryNumber = Number(salary);
  if (Number.isNaN(salaryNumber)) {
    setError("Salary must be a number");
    return;
  }

  // 3) Build payload exactly like backend schema
      const job = {
      title: title,
      type: type,
      description: description,
      
      location: location,
      salary: salaryNumber,
      company: {
        name: companyName,
        contactEmail: contactEmail,
        contactPhone: contactPhone
      }
  
  };
   // submit request 
    setIsSubmitting(true);
     try {const response =  await fetch(`/api/jobs`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(job),
  });

    if (!response.ok) {
      const json = await response.json();
      setError(json.error || "Failed to add job");
      return;
    }

    // successfully added job, navigate to home page
    const createdJob = await response.json(); 
    console.log("Created job:", createdJob);

    //home 
    navigate("/");
  } catch (err) {
    setError("An error occurred while adding the job");
  }finally{
    setIsSubmitting(false);
  }


 }
  
  return (
    <div className="create">
      <h2>Add a New Job</h2>
      <form onSubmit={submitForm}>
        <label htmlFor="title">Job title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="type">Job type:</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="" disabled>
            Select job type
          </option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
        </select>
        <label htmlFor="description">Job Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label htmlFor="companyName">Company Name:</label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <label htmlFor="contactEmail">Contact Email:</label>
        <input
          id="contactEmail"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
        <label htmlFor="contactPhone">Contact Phone:</label>
        <input
          id="contactPhone"
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />
        <label htmlFor="location">Location:</label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label htmlFor="salary">Salary:</label>
        <input
          id="salary"
          type="text"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
        />
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
};

export default AddJobPage;
