import { useState, useEffect, useRef } from 'react';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '../api/axios.js';

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = 'users/register';

function Register() {
    const userRef = useRef();
    const errRef = useRef();

    const [userName, setUserName] = useState('');
    const [validUserName, setValidUserName] = useState(false);
    const [userNameFocus, setUserNameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatchPwd, setValidMatchPwd] = useState(false);
    const [matchPwdFocus, setMatchPwdFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // on load foucs username input box
    useEffect(() => {
        userRef.current.focus();
    }, []);

    // check the userName validation
    useEffect(() => {
        const result = USER_REGEX.test(userName);
        console.log(result);
        console.log(userName);
        setValidUserName(result);
    }, [userName]);

    // check the Email validation
    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
    }, [email]);

    // check password match validation
    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(`password is ${result}`);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatchPwd(match);
    }, [pwd, matchPwd]);

    // error message
    useEffect(() => {
        setErrMsg('');
    }, [userName, pwd, matchPwd]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                REGISTER_URL,
                JSON.stringify({
                    name: userName,
                    email,
                    password: pwd,
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            console.log(`Response from the server is ${JSON.stringify(response)}`);
            console.log(`Access Token is ${response.data.token}`);
            setSuccess(true);

            // clear Input Fields
            e.target.reset();
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Email taken');
            } else {
                setErrMsg('Registration Failed');
            }

            errRef.current.focus();
        }
    };

    /* const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, email, password, password2 } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess || user) {
            navigate('/');
        }

        dispatch(reset());
    }, [user, isError, v, message, navigate, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (password !== password2) {
            toast.error('Passwords do not match');
        } else {
            const userData = {
                name,
                email,
                password,
            };

            dispatch(register(userData));
        }
    };

    if (isLoading) {
        return <Spinner />;
    }*/

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section className="heading">
                    <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
                        {errMsg}
                    </p>
                    <h1>Register</h1>
                    <p>Please create an account</p>

                    {/* <form onSubmit={onSubmit}> */}
                    <form onSubmit={handleSubmit}>
                        {/* aria-describedby reads 1) Label 2)type of input 3) aria-invalid 4) aria-describedby */}
                        <label htmlFor="name">
                            UserName:
                            <span className={validUserName ? 'valid' : 'hide'}>
                                {' '}
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validUserName || userName.length <= 0 ? 'hide' : 'invalid'}>
                                {' '}
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            ref={userRef}
                            autoComplete="off"
                            required
                            onChange={(e) => setUserName(e.target.value)}
                            onFocus={() => setUserNameFocus(true)}
                            onBlur={() => setUserNameFocus(false)}
                            aria-invalid={validUserName ? 'false' : 'true'}
                            aria-describedby="uidnote"
                        />
                        {/* userName means that is userName is not empty. Which is equivalent to userName.length > 0 */}

                        <p id="uidnote" className={userNameFocus && userName && !validUserName ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters. <br />
                            Must begin with a letter.
                            <br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        <label htmlFor="email">
                            Email:
                            <span className={validEmail ? 'valid' : 'hide'}>
                                {' '}
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validEmail || !email ? 'hide' : 'invalid'}>
                                {' '}
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="off"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                            aria-invalid={validUserName ? 'false' : 'true'}
                            aria-describedby="emailnote"
                        />

                        <p id="emailnote" className={emailFocus && email && !validEmail ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            must have @ and . <br />
                        </p>

                        <label htmlFor="password">
                            Password:
                            <span className={validPwd ? 'valid' : 'hide'}>
                                {' '}
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validPwd || !pwd ? 'hide' : 'invalid'}>
                                {' '}
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="off"
                            required
                            // className="form-control"

                            onChange={(e) => setPwd(e.target.value)}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                            aria-invalid={validPwd ? 'false' : 'true'}
                            aria-describedby="pwdnote"
                        />
                        {/* userName means that is userName is not empty. Which is equivalent to userName.length > 0 */}

                        <p id="pwdnote" className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 12 characters. <br />
                            Must include uppercase and lowercase letters a number and a special character.
                            <br />
                            Allowed Special Characters: <span aria-label="exclamation mark">!</span>
                            <span aria-label="at sumbol">@</span> <span aria-label="hastag">#</span>
                            <span aria-label="dollar sign">$</span>
                            <span aria-label="percent">%</span>
                        </p>

                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <span className={validMatchPwd && matchPwd ? 'valid' : 'hide'}>
                                {' '}
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validMatchPwd || !matchPwd ? 'hide' : 'invalid'}>
                                {' '}
                                <FontAwesomeIcon icon={faTimes} />
                            </span>
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            autoComplete="off"
                            required
                            // className="form-control"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            onFocus={() => setMatchPwdFocus(true)}
                            onBlur={() => setMatchPwdFocus(false)}
                            aria-invalid={validPwd ? 'false' : 'true'}
                            aria-describedby="confirmnote"
                        />
                        {/* userName means that is userName is not empty. Which is equivalent to userName.length > 0 */}

                        <p id="confirmnote" className={matchPwdFocus && !validMatchPwd ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <button
                            type="submit"
                            disabled={!validUserName || !validEmail || !validPwd || !validMatchPwd ? true : false}
                            className="btn btn-block"
                        >
                            Submit
                        </button>
                    </form>

                    <p>
                        Already registered?
                        <br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    );
}

export default Register;
