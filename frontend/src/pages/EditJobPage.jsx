
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditJobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) {
          console.error("Failed fetching job", res.status);
          return;
        }
        const data = await res.json();

        setTitle(data.title ?? "");
        setType(data.type ?? "");
        setDescription(data.description ?? "");
        setCompanyName(data.company?.name ?? "");
        setContactEmail(data.company?.contactEmail ?? "");
        setContactPhone(data.company?.contactPhone ?? "");
        setLocation(data.location ?? "");
        setSalary(String(data.salary ?? ""));
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchJob();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const updatedJob = {
      title,
      type,
      description,
      location,
      salary, // keep as string
      company: {
        name: companyName,
        contactEmail,
        contactPhone,
      },
    };

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedJob),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Update failed", data);
        setError(data.error || data.message || "Failed to update job");
        return;
      }

      await res.json().catch(() => null);
      navigate(`/jobs/${id}`);
    } catch (err) {
      console.error(err);
      setError("Network error");
    }
  };

  const handleCancel = () => {
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="create">
      <h2>Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <label>Job title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Job type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="" disabled>
            Select job type
          </option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
        </select>

        <label>Job Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Company Name:</label>
        <input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <label>Contact Email:</label>
        <input
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />

        <label>Contact Phone:</label>
        <input
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
        />

        <label>Location:</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} />

        <label>Salary:</label>
        <input value={salary} onChange={(e) => setSalary(e.target.value)} />

        <button type="submit">Update Job</button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>

        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
};

export default EditJobPage;

