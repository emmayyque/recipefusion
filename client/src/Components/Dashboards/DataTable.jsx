import React from "react";
import "./DataTable.css";
import Sidebar from "./Sidebar";
import Loader from "../Loader"; 

const getValueByKey = (obj, keyPath) => {
  return keyPath.split(".").reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : "";
  }, obj);
};

function DataTable({ title, data, columns, actions, loading }) {
  return (
    <div style={{ display: "flex", height: "100vh", flexDirection: "row" }}>
      <Sidebar />
      <div className="user-table">
        <h3 className="table-header">{title}</h3>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} style={{ textAlign: "center", padding: "2rem" }}>
                    Loading the data
                    <Loader />
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.key === "image" ? (
                          <img
                            src={getValueByKey(item, col.key)}
                            alt={item.name || "Image"}
                            className="table-image"
                          />
                        ) : (
                          <>{getValueByKey(item, col.key)}</>
                        )}
                      </td>
                    ))}
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className="btn-1"
                          onClick={() => action.onClick(item)}
                        >
                          {action.icon} {action.label}
                        </button>
                      ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
