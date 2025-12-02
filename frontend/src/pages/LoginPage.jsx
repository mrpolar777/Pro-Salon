import React, { useState } from "react";
import Logo from "../assets/icon prosalon.png";
import EmailIcon from "../assets/icon email.png";
import CadeadoIcon from "../assets/icon cadeado.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (result.success) {
      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="app-root">
      <div className="card">
        <div className="card-left">
          <img
            src={Logo}
            alt="Logo pro salon"
            width={144}
            height={144}
            loading="lazy"
          />
          <h1>Bem-Vindo!</h1>
          <p>Sua gestão inteligente para um salão mais eficiente!</p>
        </div>
        <div className="card-right">
          <h2>Acesse sua conta</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="input-label">
              <img
                src={EmailIcon}
                alt="Icone Email"
                width={32}
                height={32}
                loading="lazy"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="input-label">
              <img
                src={CadeadoIcon}
                alt="Icone Cadeado"
                width={32}
                height={32}
                loading="lazy"
              />
              <input type="password" placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required />
            </label>

            {error && <p className="error">{error}</p>}

            <button className="btn-submit" type="submit">
              Entrar
            </button>
          </form>

          <p className="signup">
            Ainda não tem cadastro?<a href="#">Cadastra-se</a>
          </p>
        </div>
      </div>
    </div>
  );
}
