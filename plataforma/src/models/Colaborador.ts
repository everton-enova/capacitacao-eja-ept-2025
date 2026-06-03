import mongoose, { Schema, model, models } from 'mongoose'

const ColaboradorSchema = new Schema({
  cpf:    { type: String, required: true, unique: true, index: true },
  nome:   { type: String, required: true },
  funcao: { type: String, required: true, enum: ['Coordenador Estadual', 'Subcoordenador Estadual', 'Coordenador Territorial'] },
  nte:    { type: String, default: '' },
  ativo:  { type: Boolean, default: true },
}, { timestamps: true })

export const Colaborador = models.Colaborador ?? model('Colaborador', ColaboradorSchema)
