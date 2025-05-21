import { Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { history } from './utils/history'
import AdminTemplate from './templates/AdminTemplate/AdminTemplate'
import Login from './pages/User/Login';
import Register from './pages/User/Register';
import UserTemplate from './templates/UserTemplate/UserTemplate';
import Home from './pages/User/Home';
import InforUser from './pages/User/InforUser';
import Detail from './pages/User/Detail';
import NotFound from './pages/NotFound';
import AboutApp from './pages/User/AboutApp';
import News from './pages/User/News';
import BookingTicket from './pages/User/BookingTicket';
import Dashboard from './pages/Admin/Dashboard';
import Film from './pages/Admin/Film/Film';
import Showtime from './pages/Admin/Film/Showtime';
import AddNewFilm from './pages/Admin/Film/AddNewFilm';
import Users from './pages/Admin/Users/Users'
import EditFilm from './pages/Admin/Film/EditFilm';
import EditUser from './pages/Admin/Users/EditUser';
import ForgotPassword from './pages/User/ForgotPassword';
import ResetPassword from './pages/User/ResetPassword';
import AddCinema from './pages/Admin/Cinema/AddCinema';
import Cinema from './pages/Admin/Cinema/Cinema';
import EditCinema from './pages/Admin/Cinema/EditCinema';
import Room from './pages/Admin/Room/Room';
import EditRoom from './pages/Admin/Room/EditRoom';
import AddRoom from './pages/Admin/Room/AddRoom';
import SeatManager from './pages/Admin/Room/Seat';
import Schedule from './pages/Admin/Film/Schedule';
import BookingFoodAndDrink from './pages/User/BookingFoodAndDrink';

function App() {
    return (
        <HistoryRouter history={history}>
            <Routes>
                <Route path='/' element={<UserTemplate />}>
                    <Route index path='/' element={<Home />} />
                    <Route path='*' element={<NotFound />} />
                    <Route path='notfound' element={<NotFound />} />
                    <Route path='detail/:id' element={<Detail />} />
                    <Route path='inforUser' element={<InforUser />} />
                    <Route path='login' element={<Login />} />
                    <Route path='register' element={<Register />} />
                    <Route path='aboutapp' element={<AboutApp />} />
                    <Route path='news' element={<News />} />
                    <Route path='booking/:id' element={<BookingTicket />} />
                    <Route path="/forget-password" element={<ForgotPassword />} />
                    <Route path="reset-password/:otp" element={<ResetPassword />} />
                    <Route path='foodanddrink' element={<BookingFoodAndDrink />} />
                </Route>
                <Route path='/admin' element={<AdminTemplate />}>
                    <Route path='/admin' index element={<Dashboard />} />
                    <Route path='user' element={<Users />} />
                    <Route path='user/edit/:id' element={<EditUser />} />
                    <Route path='film' element={<Film />} />
                    <Route path='film/edit/:movieId' element={<EditFilm />} />
                    <Route path='film/showtime/:id/:movieName' element={<Showtime />} />
                    <Route path='film/addnewfilm' element={<AddNewFilm />} />
                    <Route path='showtime' element={<Showtime />} />
                    <Route path='cinema/addnewcinema' element={<AddCinema />} />
                    <Route path='cinema' element={<Cinema />} />
                    <Route path='cinema/edit/:cinemaId' element={<EditCinema />} />
                    <Route path='room' element={<Room />} />
                    <Route path='room/edit/:roomId' element={<EditRoom />} />
                    <Route path='room/addnewroom' element={<AddRoom />} />
                    <Route path="room/:roomId/seats" element={<SeatManager />} />
                    <Route path='schedule' element={<Schedule />} />
                </Route>
            </Routes>
        </HistoryRouter>
    );
}
export default App;
