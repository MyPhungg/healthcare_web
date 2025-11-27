import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layout/authLayout';
import Login from '../pages/authPages/login';
import Register from '../pages/authPages/register';
import WebLayout from '../layout/webLayout';
import Home from '../pages/webPages/home';
import DoctorScheduleList from '../pages/webPages/list_doctor_schedule';
import Booking from '../pages/webPages/booking';
import BookingSuccess from '../pages/webPages/bookingsuccess';
import ScrollToTop from '../components/common/SrolltoTop';
import Profile from '../pages/webPages/profile';
import DashboardLayout from '../layout/dashBoardLayout';
import Overview from '../pages/dashboardPages/overView';
import DoctorDashboard from '../pages/dashboardPages/doctorDashboard';
import DoctorProfile from '../pages/dashboardPages/doctorProfile';
import DoctorSchedule from '../pages/dashboardPages/doctorSchedule';
import AppointmentManagement from '../pages/dashboardPages/appointmentManagerment';
import PatientManagement from '../pages/dashboardPages/patientManagerment';
import DoctorManagement from '../pages/dashboardPages/doctorManagerment';
import ReportPage from '../pages/dashboardPages/report';
import DoctorAppointment from '../pages/dashboardPages/doctorAppointments';
import DoctorPatient from '../pages/dashboardPages/doctorPatients';
import AddDoctorSchedule from '../pages/dashboardPages/addDoctorSchedule';
import AboutUs from '../pages/webPages/aboutus';
import DoctorDetail from '../pages/webPages/DoctorDetail';
import DoctorRegister from '../pages/dashboardPages/DoctorRegister';
import UserManagement from '../pages/dashboardPages/userManagement';
import SearchResults from '../components/web/searchResult';

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<WebLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUs/>} />
          <Route path="/doctors" element={<div>Doctors Page</div>} />
          <Route path="/specialties" element={<div>Specialties Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/list_doctor_schedule" element={<DoctorScheduleList />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/bookingsuccess" element={<BookingSuccess/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/doctordetail/:doctorId" element={<DoctorDetail/>} />
          <Route path="/doctor-register" element={<DoctorRegister/>} />
          <Route path="/search-results" element={<SearchResults/>} />
          {/* Add more routes as needed */}
        </Route>
                {/* Admin Dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout userRole="admin" />}>
          <Route index element={<Overview />} />
          <Route path="doctors" element={<DoctorManagement/>} />
          <Route path="patients" element={<PatientManagement/>} />
          <Route path="appointments" element={<AppointmentManagement/>} />
          <Route path="reports" element={<ReportPage/>} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Doctor Dashboard routes */}
        
        <Route path="/doctor" element={<DashboardLayout userRole="doctor" />}>
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="appointments" element={<DoctorAppointment/>} />
          <Route path="patients" element={<DoctorPatient/>} />
          <Route path="add-schedule" element={<AddDoctorSchedule/>} />
          
        </Route>

        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        
        {/* Other routes... */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;