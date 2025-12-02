import React from "react";
import Logo from "../assets/icon prosalon.png";
import EmailIcon from '../assets/icon email.png'
import CadeadoIcon from '../assets/icon cadeado.png'

export default function Login() {
  return (
    <div className="login-page">
      <div className="card">
        <div className="card-left">
          <img src={Logo} alt="Logo pro salon" width={144} height={144} loading="lazy"/>
          <h1>Bem-Vindo!</h1>
          <p>Sua gestão inteligente para um salão mais eficiente!</p>
        </div>
        <div className="card-right">
          <h2>Acesse sua conta</h2>
          <form className="login-form">
            <label className="input-label">
              <img src={EmailIcon} alt="Icone Email" width={32} height={32} loading="lazy"/>
              <input type="email" placeholder="E-mail" required/>
            </label>
            <label className="input-label">
              <img src={CadeadoIcon} alt="Icone Cadeado" width={32} height={32} loading="lazy"/>
              <input type="password" placeholder="Senha" required/>
            </label>

            <button className="btn-submit" type="submit">Entrar</button>
          </form>

          <p className="signup">Ainda não tem cadastro?<a href="#">Cadastra-se</a></p>
        </div>
      </div>
    </div>
  );
}
