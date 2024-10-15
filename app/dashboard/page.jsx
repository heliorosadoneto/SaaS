"use client";
import React, { useState } from "react";
import "@/app/dashboard/style.css";

function AddressForm() {
  const [formData, setFormData] = useState({
    pais: "Brasil",
    cep: "",
    endereco: "",
    complemento: "",
    estado: "",
    cidade: "",
    bairro: "",
    celular: "",
  });

  return (
    <form className="form-container">
      <h2 className="form-title">Endereço</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="pais">País</label>
          <select name="pais" value={formData.pais} className="form-control">
            <option>Brasil</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="cep">CEP</label>
          <input
            type="text"
            name="cep"
            value={formData.cep}
            className="form-control"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="endereco">Endereço</label>
          <input
            type="text"
            name="endereco"
            value={formData.endereco}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="complemento">complemento</label>
          <input
            type="text"
            name="complemento"
            value={formData.complemento}
            className="form-control"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <input
            type="text"
            name="estado"
            value={formData.estado}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cidade">Cidade</label>
          <input
            type="text"
            name="cidade"
            value={formData.cidade}
            className="form-control"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bairro">Bairro</label>
          <input
            type="text"
            name="bairro"
            value={formData.bairro}
            className="form-control"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="celular">Celular (opcional)</label>
        <input
          type="text"
          name="celular"
          value={formData.celular}
          className="form-control"
        />
      </div>

      <button type="submit" className="submit-button">
        Salvar Endereço
      </button>
    </form>
  );
}

export default AddressForm;
