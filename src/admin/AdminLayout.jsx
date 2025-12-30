import { NavLink, Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-xl font-bold mb-6 text-blue-600">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "font-semibold text-blue-600" : "text-gray-600"
            }
          >
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/admin/doctors"
            className={({ isActive }) =>
              isActive ? "font-semibold text-blue-600" : "text-gray-600"
            }
          >
            👨‍⚕️ Doctors
          </NavLink>

          <NavLink
            to="/admin/appointments"
            className={({ isActive }) =>
              isActive ? "font-semibold text-blue-600" : "text-gray-600"
            }
          >
            📅 Appointments
          </NavLink>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
