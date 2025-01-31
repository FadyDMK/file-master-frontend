import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [subfolders, setSubfolders] = useState([]);
  const [folder, setFolder] = useState({
    id: 21,
    name: "index_16",
    path: "uploads/index_16",
    createdAt: "2024-12-08T17:33:18.041Z",
    updatedAt: "2024-12-08T17:33:18.041Z",
    parentId: null,
    ownerId: 16,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  //get current folder name
  useEffect(() => {
    const fetchName = async () => {
      try {
        const folderId = new URLSearchParams(location.search).get("folderId");
        if (folderId) {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/files/folders/${folderId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log(response.data);
          setFolder(response.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
      }
    };
    fetchName();
  }, [location.search]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const folderId = new URLSearchParams(location.search).get("folderId");
        const url = folderId
          ? `${import.meta.env.VITE_BACKEND_URL}/api/files/${folderId}`
          : `${import.meta.env.VITE_BACKEND_URL}/api/files/main-folder`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setFiles(response.data.files || []);
        setSubfolders(response.data.folders);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
      }
    };
    fetchData();
  }, [location.search]);

  const handleFolderClick = (folderId) => {
    navigate(`/files?folderId=${folderId}`);
  };

  const handleFileClick = async (fileId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/files/download/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          responseType: "blob", // Important to handle binary data
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      console.log(response.headers["content-disposition"]);
      console.log(response);

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = response.headers["content-disposition"]
        .split("filename=")[1]
        .replace(/"/g, "");

      console.log(
        response.headers["content-disposition"]
          .split("filename=")[1]
          .replace(/"/g, "")
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      setError(error.response?.data?.message || "Failed to download file");
    }
  };

  return (
    <div>
      <h1>{folder.name} Files</h1>
      {error && <p>{error}</p>}
      <h2>Subfolders</h2>
      <ul>
        {subfolders.map((folder) => (
          <li
            key={folder.id}
            className="text-blue-400 cursor-pointer"
            onClick={() => handleFolderClick(folder.id)}
          >
            {folder.name}
          </li>
        ))}
      </ul>
      <h2>Files</h2>
      <ul>
        {files.map((file) => (
          <li
            key={file.id}
            className="text-blue-400 cursor-pointer"
            onClick={() => handleFileClick(file.id)}
          >
            {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
