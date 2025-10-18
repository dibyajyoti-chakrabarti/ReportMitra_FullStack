import {Link} from "react-router-dom";
function Landing(){
    return (
        <div>
            Hello from landing
            <div className="flex flex-col">
                <Link to='/Login'>Login</Link>
                <Link to='/Signin'>Signin</Link>
                <Link to='/Track'>Track</Link>
                <Link to='/Report'>Report</Link>
                <Link to='/Profile'>Profile</Link>
            </div>
            
        </div>
    );
}
export default Landing;