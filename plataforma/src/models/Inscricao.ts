import { Schema, model, models } from 'mongoose'

const InscricaoSchema = new Schema({
  nome:             { type: String, required: true },
  cpf:              { type: String, required: true, unique: true },
  email:            { type: String, required: true },
  contato:          { type: String, required: true },
  funcao:           { type: String, required: true },
  nte:              { type: String, default: '' },
  municipio:        { type: String, default: '' },
  tipoDeslocamento: { type: String, default: '' },
  quilometragem:    { type: String, default: '' },
  valorTransporte:  { type: String, default: '' },
  hospedagem:       { type: String, default: '' },
  banco:            { type: String, required: true },
  agencia:          { type: String, required: true },
  conta:            { type: String, required: true },
  tipoConta:        { type: String, required: true },
  tipoChavePix:     { type: String, required: true },
  chavePix:         { type: String, required: true },
}, { timestamps: true })

export const Inscricao = models.Inscricao ?? model('Inscricao', InscricaoSchema)
