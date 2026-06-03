'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const NTE_LIST = [
  { label: "NTE 01 - Irecê",                      muns: ["AMERICA DOURADA","BARRA DO MENDES","BARRO ALTO","CAFARNAUM","CANARANA","CENTRAL","GENTIO DO OURO","IBIPEBA","IBITITA","IPUPIARA","IRECE","ITAGUACU DA BAHIA","JOAO DOURADO","JUSSARA","LAPAO","MULUNGU DO MORRO","PRESIDENTE DUTRA","SAO GABRIEL","UIBAI","XIQUE-XIQUE"] },
  { label: "NTE 02 - Velho Chico",                 muns: ["BARRA","BOM JESUS DA LAPA","BROTAS DE MACAUBAS","CARINHANHA","FEIRA DA MATA","IBOTIRAMA","IGAPORA","MALHADA","MATINA","MORPARA","MUQUEM DE SAO FRANCISCO","OLIVEIRA DOS BREJINHOS","PARATINGA","RIACHO DE SANTANA","SERRA DO RAMALHO","SITIO DO MATO"] },
  { label: "NTE 03 - Chapada Diamantina",          muns: ["ABAIRA","ANDARAI","BARRA DA ESTIVA","BONINAL","BONITO","IBICOARA","IBITIARA","IRAMAIA","IRAQUARA","ITAETE","JUSSIAPE","LENCOIS","MARCIONILIO SOUZA","MORRO DO CHAPEU","MUCUGE","NOVA REDENCAO","NOVO HORIZONTE","PALMEIRAS","PIATA","RIO DE CONTAS","SEABRA","SOUTO SOARES","UTINGA","WAGNER"] },
  { label: "NTE 04 - Sisal",                       muns: ["ARACI","BARROCAS","BIRITINGA","CANDEAL","CANSANCAO","CONCEICAO DO COITE","ICHU","ITIUBA","LAMARAO","MONTE SANTO","NORDESTINA","QUEIMADAS","QUIJINGUE","RETIROLANDIA","SANTALUZ","SAO DOMINGOS","SERRINHA","TEOFILANDIA","TUCANO","VALENTE"] },
  { label: "NTE 05 - Litoral Sul",                 muns: ["ALMADINA","ARATACA","AURELINO LEAL","BARRO PRETO","BUERAREMA","CAMACAN","CANAVIEIRAS","COARACI","FLORESTA AZUL","IBICARAI","ILHEUS","ITABUNA","ITACARE","ITAJU DO COLONIA","ITAJUIPE","ITAPE","ITAPITANGA","JUSSARI","MARAU","MASCOTE","PAU BRASIL","SANTA LUZIA","SAO JOSE DA VITORIA","UBAITABA","UNA","URUCUCA"] },
  { label: "NTE 06 - Baixo Sul",                   muns: ["ARATUIPE","CAIRU","CAMAMU","GANDU","IBIRAPITANGA","IGRAPIUNA","ITUBERA","JAGUARIPE","NILO PECANHA","PIRAI DO NORTE","PRESIDENTE TANCREDO NEVES","TAPEROA","TEOLANDIA","VALENCA","WENCESLAU GUIMARAES"] },
  { label: "NTE 07 - Extremo Sul",                 muns: ["ALCOBACA","CARAVELAS","IBIRAPUA","ITAMARAJU","ITANHEM","JUCURUCU","LAJEDAO","MEDEIROS NETO","MUCURI","NOVA VICOSA","PRADO","TEIXEIRA DE FREITAS","VEREDA"] },
  { label: "NTE 08 - Médio Sudoeste da Bahia",     muns: ["CAATIBA","FIRMINO ALVES","IBICUI","IGUAI","ITAMBE","ITAPETINGA","ITARANTIM","ITORORO","MACARANI","MAIQUINIQUE","NOVA CANAA","POTIRAGUA","SANTA CRUZ DA VITORIA"] },
  { label: "NTE 09 - Vale do Jiquiriçá",           muns: ["AMARGOSA","BREJOES","CRAVOLANDIA","ELISIO MEDRADO","IRAJUBA","ITAQUARA","ITIRUCU","JAGUAQUARA","JIQUIRICA","JITAUNA","LAFAIETE COUTINHO","LAJE","LAJEDO DO TABOCAL","MARACAS","MILAGRES","MUTUIPE","NOVA ITARANA","PLANALTINO","SANTA INES","SAO MIGUEL DAS MATAS","UBAIRA"] },
  { label: "NTE 10 - Sertão do São Francisco",     muns: ["CAMPO ALEGRE DE LOURDES","CANUDOS","CASA NOVA","CURACA","JUAZEIRO","PILAO ARCADO","REMANSO","SENTO SE","SOBRADINHO","UAUA"] },
  { label: "NTE 11 - Bacia do Rio Grande",         muns: ["ANGICAL","BAIANOPOLIS","BARREIRAS","BURITIRAMA","CATOLANDIA","COTEGIPE","CRISTOPOLIS","FORMOSA DO RIO PRETO","LUIS EDUARDO MAGALHAES","MANSIDAO","RIACHAO DAS NEVES","SANTA RITA DE CASSIA","SAO DESIDERIO","WANDERLEY"] },
  { label: "NTE 12 - Bacia do Paramirim",          muns: ["BOQUIRA","BOTUPORA","CATURAMA","ERICO CARDOSO","IBIPITANGA","MACAUBAS","PARAMIRIM","RIO DO PIRES"] },
  { label: "NTE 13 - Sertão Produtivo",            muns: ["BRUMADO","CACULE","CAETITE","CANDIBA","CONTENDAS DO SINCORA","DOM BASILIO","GUANAMBI","IBIASSUCE","ITUACU","IUIU","LAGOA REAL","LIVRAMENTO DE NOSSA SENHORA","MALHADA DE PEDRAS","PALMAS DE MONTE ALTO","PINDAI","RIO DO ANTONIO","SEBASTIAO LARANJEIRAS","TANHACU","TANQUE NOVO","URANDI"] },
  { label: "NTE 14 - Piemonte do Paraguaçu",       muns: ["BOA VISTA DO TUPIM","IACU","IBIQUERA","ITATIM","LAJEDINHO","MACAJUBA","MUNDO NOVO","PIRITIBA","RAFAEL JAMBEIRO","RUY BARBOSA","SANTA TERESINHA","TAPIRAMUTA"] },
  { label: "NTE 15 - Bacia do Jacuípe",            muns: ["BAIXA GRANDE","CAPIM GROSSO","CAPELA DO ALTO ALEGRE","GAVIAO","IPIRA","MAIRI","NOVA FATIMA","PE DE SERRA","PINTADAS","QUIXABEIRA","RIACHAO DO JACUIPE","SAO JOSE DO JACUIPE","SERRA PRETA","VARZEA DA ROCA","VARZEA DO POCO"] },
  { label: "NTE 16 - Piemonte da Diamantina",      muns: ["CAEM","JACOBINA","MIGUEL CALMON","MIRANGABA","OUROLANDIA","SAUDE","SERROLANDIA","UMBURANAS","VARZEA NOVA"] },
  { label: "NTE 17 - Semiárido Nordeste II",        muns: ["ADUSTINA","ANTAS","BANZAE","CICERO DANTAS","CIPO","CORONEL JOAO SA","EUCLIDES DA CUNHA","FATIMA","HELIOPOLIS","JEREMOABO","NOVA SOURE","NOVO TRIUNFO","PARIPIRANGA","PEDRO ALEXANDRE","RIBEIRA DO AMPARO","RIBEIRA DO POMBAL","SITIO DO QUINTO"] },
  { label: "NTE 18 - Litoral Norte e Agreste",     muns: ["ACAJUTIBA","ALAGOINHAS","APORA","ARACAS","ARAMARI","CARDEAL DA SILVA","CATU","CONDE","CRISOPOLIS","ENTRE RIOS","ESPLANADA","INHAMBUPE","ITANAGRA","ITAPICURU","JANDAIRA","OLINDINA","OURICANGAS","PEDRAO","RIO REAL","SATIRO DIAS"] },
  { label: "NTE 19 - Portal do Sertão",            muns: ["AGUA FRIA","AMELIA RODRIGUES","ANGUERA","ANTONIO CARDOSO","CONCEICAO DA FEIRA","CONCEICAO DO JACUIPE","CORACAO DE MARIA","FEIRA DE SANTANA","IPECAETA","IRARA","SANTA BARBARA","SANTANOPOLIS","SANTO ESTEVAO","SAO GONCALO DOS CAMPOS","TANQUINHO","TEODORO SAMPAIO","TERRA NOVA"] },
  { label: "NTE 20 - Sudoeste Baiano",             muns: ["ANAGE","ARACATU","BARRA DO CHOCA","BELO CAMPO","BOM JESUS DA SERRA","CAETANOS","CANDIDO SALES","CARAIBAS","CONDEUBA","CORDEIROS","ENCRUZILHADA","GUAJERU","JACARACI","LICINIO DE ALMEIDA","MAETINGA","MIRANTE","MORTUGABA","PIRIPA","PLANALTO","POCOES","PRESIDENTE JANIO QUADROS","RIBEIRAO DO LARGO","TREMEDAL","VITORIA DA CONQUISTA"] },
  { label: "NTE 21 - Recôncavo",                   muns: ["CABACEIRAS DO PARAGUACU","CACHOEIRA","CASTRO ALVES","CONCEICAO DO ALMEIDA","CRUZ DAS ALMAS","DOM MACEDO COSTA","GOVERNADOR MANGABEIRA","MARAGOGIPE","MUNIZ FERREIRA","MURITIBA","NAZARE","SALINAS DA MARGARIDA","SANTO AMARO","SANTO ANTONIO DE JESUS","SAO FELIPE","SAO FELIX","SAPEACU","SAUBARA","VARZEDO"] },
  { label: "NTE 22 - Médio Rio de Contas",         muns: ["AIQUARA","APUAREMA","BARRA DO ROCHA","BOA NOVA","DARIO MEIRA","GONGOGI","IBIRATAIA","IPIAU","ITAGI","ITAGIBA","ITAMARI","JEQUIE","JITAUNA","MANOEL VITORINO","NOVA IBIA","UBATA"] },
  { label: "NTE 23 - Bacia do Rio Corrente",       muns: ["BREJOLANDIA","CANAPOLIS","COCOS","CORIBE","CORRENTINA","JABORANDI","SANTA MARIA DA VITORIA","SANTANA","SAO FELIX DO CORIBE","SERRA DOURADA","TABOCAS DO BREJO VELHO"] },
  { label: "NTE 24 - Itaparica",                   muns: ["ABARE","CHORROCHO","GLORIA","MACURURE","PAULO AFONSO","RODELAS"] },
  { label: "NTE 25 - Piemonte Norte do Itapicuru", muns: ["ANDORINHA","ANTONIO GONCALVES","CALDEIRAO GRANDE","CAMPO FORMOSO","FILADELFIA","JAGUARARI","PINDOBACU","PONTO NOVO","SENHOR DO BONFIM"] },
  { label: "NTE 26 - Metropolitano de Salvador",   muns: ["CAMACARI","CANDEIAS","DIAS D AVILA","ITAPARICA","LAURO DE FREITAS","MADRE DE DEUS","MATA DE SAO JOAO","POJUCA","SALVADOR","SAO FRANCISCO DO CONDE","SAO SEBASTIAO DO PASSE","SIMOES FILHO","VERA CRUZ"] },
  { label: "NTE 27 - Costa do Descobrimento",      muns: ["BELMONTE","EUNAPOLIS","GUARATINGA","ITABELA","ITAGIMIRIM","ITAPEBI","PORTO SEGURO","SANTA CRUZ CABRALIA"] },
]

const TODOS_MUNICIPIOS = ["Abaíra","Abaré","Acajutiba","Adustina","Água Fria","Aiquara","Alagoinhas","Alcobaça","Almadina","Amargosa","Amélia Rodrigues","América Dourada","Anagé","Andaraí","Andorinha","Angical","Anguera","Antas","Antônio Cardoso","Antônio Gonçalves","Aporá","Apuarema","Araçás","Aracatu","Araci","Aramari","Arataca","Aratuípe","Aurelino Leal","Baianópolis","Baixa Grande","Banzaê","Barra","Barra da Estiva","Barra do Choça","Barra do Mendes","Barra do Rocha","Barreiras","Barro Alto","Barro Preto","Barrocas","Belmonte","Belo Campo","Biritinga","Boa Nova","Boa Vista do Tupim","Bom Jesus da Lapa","Bom Jesus da Serra","Boninal","Bonito","Boquira","Botuporã","Brejões","Brejolândia","Brotas de Macaúbas","Brumado","Buerarema","Buritirama","Caatiba","Cabaceiras do Paraguaçu","Cachoeira","Caculé","Caém","Caetanos","Caetité","Cafarnaum","Cairu","Caldeirão Grande","Camacan","Camaçari","Camamu","Campo Alegre de Lourdes","Campo Formoso","Canápolis","Canarana","Canavieiras","Candeal","Candeias","Candiba","Cândido Sales","Cansanção","Canudos","Capela do Alto Alegre","Capim Grosso","Caraíbas","Caravelas","Cardeal da Silva","Carinhanha","Casa Nova","Castro Alves","Catolândia","Catu","Caturama","Central","Chorrochó","Cícero Dantas","Cipó","Coaraci","Cocos","Conceição da Feira","Conceição do Almeida","Conceição do Coité","Conceição do Jacuípe","Conde","Condeúba","Contendas do Sincorá","Coração de Maria","Cordeiros","Coribe","Coronel João Sá","Correntina","Cotegipe","Cravolândia","Crisópolis","Cristópolis","Cruz das Almas","Curaçá","Dário Meira","Dias d'Ávila","Dom Basílio","Dom Macedo Costa","Elísio Medrado","Encruzilhada","Entre Rios","Érico Cardoso","Esplanada","Euclides da Cunha","Eunápolis","Fátima","Feira da Mata","Feira de Santana","Filadélfia","Firmino Alves","Floresta Azul","Formosa do Rio Preto","Gandu","Gavião","Gentio do Ouro","Glória","Gongogi","Governador Mangabeira","Guajeru","Guanambi","Guaratinga","Heliópolis","Iaçu","Ibiassucê","Ibicaraí","Ibicoara","Ibicuí","Ibipeba","Ibipitanga","Ibiquera","Ibirapitanga","Ibirapuã","Ibirataia","Ibitiara","Ibititá","Ibotirama","Ichu","Igaporã","Igrapiúna","Iguaí","Ilhéus","Inhambupe","Ipecaetá","Ipiaú","Ipirá","Ipupiara","Irajuba","Iramaia","Iraquara","Irará","Irecê","Itabela","Itaberaba","Itabuna","Itacaré","Itaeté","Itagi","Itagibá","Itagimirim","Itaguaçu da Bahia","Itaju do Colônia","Itajuípe","Itamaraju","Itamari","Itambé","Itanagra","Itanhém","Itaparica","Itapé","Itapebi","Itapetinga","Itapicuru","Itapitanga","Itaquara","Itarantim","Itatim","Itiruçu","Itiúba","Itororó","Ituaçu","Ituberá","Iuiú","Jaborandi","Jacaraci","Jacobina","Jaguaquara","Jaguarari","Jaguaripe","Jandaíra","Jequié","Jeremoabo","Jiquiriçá","Jitaúna","João Dourado","Juazeiro","Jucuruçu","Jussara","Jussari","Jussiape","Lafaiete Coutinho","Lagoa Real","Laje","Lajedão","Lajedinho","Lajedo do Tabocal","Lamarão","Lapão","Lauro de Freitas","Lençóis","Licínio de Almeida","Livramento de Nossa Senhora","Luís Eduardo Magalhães","Macajuba","Macarani","Macaúbas","Macururé","Madre de Deus","Maetinga","Maiquinique","Mairi","Malhada","Malhada de Pedras","Manoel Vitorino","Mansidão","Maracás","Maragogipe","Maraú","Marcionílio Souza","Mascote","Mata de São João","Matina","Medeiros Neto","Miguel Calmon","Milagres","Mirangaba","Mirante","Monte Santo","Morpara","Morro do Chapéu","Mortugaba","Mucugê","Mucuri","Mulungu do Morro","Mundo Novo","Muniz Ferreira","Muquém de São Francisco","Muritiba","Mutuípe","Nazaré","Nilo Peçanha","Nordestina","Nova Canaã","Nova Fátima","Nova Ibiá","Nova Itarana","Nova Redenção","Nova Soure","Nova Viçosa","Novo Horizonte","Novo Triunfo","Olindina","Oliveira dos Brejinhos","Ouriçangas","Ourolândia","Palmas de Monte Alto","Palmeiras","Paramirim","Paratinga","Paripiranga","Pau Brasil","Paulo Afonso","Pé de Serra","Pedrão","Pedro Alexandre","Piatã","Pilão Arcado","Pindaí","Pindobaçu","Pintadas","Piraí do Norte","Piripá","Piritiba","Planaltino","Planalto","Poções","Pojuca","Ponto Novo","Porto Seguro","Potiraguá","Prado","Presidente Dutra","Presidente Jânio Quadros","Presidente Tancredo Neves","Queimadas","Quijingue","Quixabeira","Rafael Jambeiro","Remanso","Retirolândia","Riachão das Neves","Riachão do Jacuípe","Riacho de Santana","Ribeira do Amparo","Ribeira do Pombal","Ribeirão do Largo","Rio Real","Rio de Contas","Rio do Antônio","Rio do Pires","Rodelas","Ruy Barbosa","Salinas da Margarida","Salvador","Santa Bárbara","Santa Brígida","Santa Cruz Cabrália","Santa Cruz da Vitória","Santa Inês","Santa Luzia","Santa Maria da Vitória","Santa Rita de Cássia","Santa Teresinha","Santaluz","Santana","Santanópolis","Santo Amaro","Santo Antônio de Jesus","Santo Estêvão","São Desidério","São Domingos","São Felipe","São Félix","São Félix do Coribe","São Francisco do Conde","São Gabriel","São Gonçalo dos Campos","São José da Vitória","São José do Jacuípe","São Miguel das Matas","São Sebastião do Passé","Sapeaçu","Sátiro Dias","Saubara","Saúde","Seabra","Sebastião Laranjeiras","Senhor do Bonfim","Sento Sé","Serra Dourada","Serra Preta","Serra do Ramalho","Serrinha","Serrolândia","Simões Filho","Sítio do Mato","Sítio do Quinto","Sobradinho","Souto Soares","Tabocas do Brejo Velho","Tanhaçu","Tanque Novo","Tanquinho","Taperoá","Tapiramutá","Teixeira de Freitas","Teodoro Sampaio","Teofilândia","Teolândia","Terra Nova","Tremedal","Tucano","Uauá","Ubaíra","Ubaitaba","Ubatã","Uibaí","Umburanas","Una","Urandi","Uruçuca","Utinga","Valença","Valente","Várzea Nova","Várzea da Roça","Várzea do Poço","Varzedo","Vera Cruz","Vereda","Vitória da Conquista","Wagner","Wanderley","Wenceslau Guimarães","Xique-Xique"]

function normMun(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['']/g, '').toUpperCase().replace(/\s+/g, ' ').trim()
}
const MUN_LOOKUP: Record<string, string> = {}
TODOS_MUNICIPIOS.forEach(m => { MUN_LOOKUP[normMun(m)] = m })
function munAcentuado(raw: string) { return MUN_LOOKUP[raw.trim()] ?? raw }

const NTE26 = 'NTE 26 - Metropolitano de Salvador'

const inputCls = 'w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-950 focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-200 disabled:opacity-60 disabled:cursor-not-allowed'
const labelCls = 'block text-xs font-semibold text-gray-950 uppercase tracking-wide mb-1'
const sectionCls = 'text-xs font-bold tracking-widest text-gray-950 uppercase pb-2 border-b-2 border-gray-300'

export default function FormularioClient() {
  const [form, setForm] = useState({
    nome: '', cpf: '', contato: '', email: '',
    funcao: '', nte: '', municipio: '',
    tipoDeslocamento: '', quilometragem: '', valorTransporte: '',
    hospedagem: '', banco: '', tipoConta: '',
    agencia: '', conta: '', tipoChavePix: '', chavePix: '',
  })

  const [municipios, setMunicipios] = useState<string[]>([])
  const [erros, setErros] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erroGeral, setErroGeral] = useState('')

  const isTerritorial = form.funcao === 'Coordenador Territorial'
  const isNte26 = form.nte === NTE26
  const precisaDesl = !isNte26 && form.tipoDeslocamento && form.tipoDeslocamento !== 'Não precisa de deslocamento'

  useEffect(() => {}, [])

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErros(e => { const n = { ...e }; delete n[field]; return n })
  }

  function maskCPF(v: string) {
    v = v.replace(/\D/g, '')
    if (v.length > 3) v = v.slice(0, 3) + '.' + v.slice(3)
    if (v.length > 7) v = v.slice(0, 7) + '.' + v.slice(7)
    if (v.length > 11) v = v.slice(0, 11) + '-' + v.slice(11, 13)
    return v.slice(0, 14)
  }
  function maskTel(v: string) {
    v = v.replace(/\D/g, '')
    if (v.length > 0) v = '(' + v
    if (v.length > 3) v = v.slice(0, 3) + ') ' + v.slice(3)
    if (v.length > 10) v = v.slice(0, 10) + '-' + v.slice(10, 15)
    return v.slice(0, 15)
  }
  function maskMoeda(v: string) {
    v = v.replace(/\D/g, '')
    if (!v) return ''
    v = v.replace(/^0+/, '') || '0'
    const cents = v.slice(-2).padStart(2, '0')
    const reais = (v.length > 2 ? v.slice(0, -2) : '0').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    return 'R$ ' + reais + ',' + cents
  }

  function onFuncaoChange(funcao: string) {
    setForm(f => ({ ...f, funcao, nte: '', municipio: '' }))
    setMunicipios([])
  }

  function onNteChange(nteLabel: string) {
    const entry = NTE_LIST.find(n => n.label === nteLabel)
    const muns = entry ? entry.muns.map(munAcentuado) : []
    setMunicipios(muns)
    setForm(f => ({ ...f, nte: nteLabel, municipio: '',
      tipoDeslocamento: nteLabel === NTE26 ? '' : f.tipoDeslocamento,
      hospedagem: nteLabel === NTE26 ? '' : f.hospedagem,
    }))
  }

  function validarCPF(cpf: string) {
    cpf = cpf.replace(/\D/g, '')
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
    let s = 0, r: number
    for (let i = 0; i < 9; i++) s += parseInt(cpf[i]) * (10 - i)
    r = 11 - (s % 11); if (r >= 10) r = 0; if (r !== parseInt(cpf[9])) return false
    s = 0
    for (let i = 0; i < 10; i++) s += parseInt(cpf[i]) * (11 - i)
    r = 11 - (s % 11); if (r >= 10) r = 0
    return r === parseInt(cpf[10])
  }

  function validar() {
    const e: Record<string, string> = {}
    if (!form.nome.trim()) e.nome = 'Informe o nome completo.'
    if (!validarCPF(form.cpf)) e.cpf = 'CPF inválido.'
    if (form.contato.replace(/\D/g, '').length < 10) e.contato = 'Contato inválido.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido.'
    if (isTerritorial) {
      if (!form.nte) e.nte = 'Selecione o NTE.'
      if (!form.municipio) e.municipio = 'Selecione o município.'
    }
    if (!isNte26) {
      if (!form.tipoDeslocamento) e.tipoDeslocamento = 'Selecione o tipo de deslocamento.'
      if (precisaDesl) {
        if (!form.quilometragem || parseInt(form.quilometragem) < 1) e.quilometragem = 'Informe a quilometragem.'
        if (!form.valorTransporte || form.valorTransporte === 'R$ 0,00') e.valorTransporte = 'Informe o valor.'
      }
      if (!form.hospedagem) e.hospedagem = 'Selecione uma opção.'
    }
    if (!form.banco.trim()) e.banco = 'Informe o banco.'
    if (!form.tipoConta) e.tipoConta = 'Selecione o tipo de conta.'
    if (!form.agencia.trim()) e.agencia = 'Informe a agência.'
    if (!form.conta.trim()) e.conta = 'Informe o número da conta.'
    if (!form.tipoChavePix) e.tipoChavePix = 'Selecione o tipo de chave.'
    if (!form.chavePix.trim()) e.chavePix = 'Informe a chave PIX.'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErroGeral('')
    const errosValidacao = validar()
    if (Object.keys(errosValidacao).length > 0) { setErros(errosValidacao); return }
    setLoading(true)
    const payload = {
      ...form,
      nte: isTerritorial ? form.nte : '',
      municipio: isTerritorial ? form.municipio : '',
      tipoDeslocamento: isNte26 ? '' : form.tipoDeslocamento,
      quilometragem: precisaDesl ? form.quilometragem : '',
      valorTransporte: precisaDesl ? form.valorTransporte : '',
      hospedagem: isNte26 ? '' : form.hospedagem,
    }
    const res = await fetch('/api/inscricao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setLoading(false)
    if (res.ok) { setSucesso(true) }
    else { const d = await res.json(); setErroGeral(d.error ?? 'Erro ao enviar. Tente novamente.') }
  }

  function Field({ id, label, erro, children }: { id: string; label: string; erro?: string; children: React.ReactNode }) {
    return (
      <div>
        <label className={labelCls}>{label}</label>
        {children}
        {erro && <p className="text-xs text-red-600 mt-1 font-medium">{erro}</p>}
      </div>
    )
  }

  if (sucesso) {
    return (
      <main className="min-h-screen bg-[#e8e8e8] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm w-full max-w-md p-10 text-center space-y-4">
          <div className="text-5xl">✅</div>
          <h2 className="text-xl font-bold text-gray-900">Cadastro realizado!</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Seus dados foram registrados com sucesso.<br/>
            Agora você pode acessar o painel com o seu CPF.
          </p>
          <a
            href="/login"
            className="inline-block w-full bg-gray-900 text-white rounded-xl py-3 font-semibold text-sm hover:bg-gray-700 transition mt-2"
          >
            Acessar o painel
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      {/* Painel esquerdo — fixo no desktop */}
      <div
        className="hidden lg:flex fixed top-0 left-0 h-screen w-80 xl:w-96 flex-col justify-between p-10 z-10"
        style={{ backgroundImage: "url('/background.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(28,28,28,0.92)' }} />

        <div className="relative z-10 text-white">
          <Image src="/brasao_estado.png" alt="Estado da Bahia" width={84} height={84} className="mb-8" />
          <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-3">
            Capacitação para<br />Equipe de Campo
          </p>
          <h1 className="text-3xl font-bold leading-snug">
            Avaliação<br />de Entrada<br />EJA e EPT
          </h1>
        </div>

        <div className="relative z-10 text-white space-y-6">
          <div className="border-t border-white/15 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Data</p>
            <p className="text-sm font-light text-white/90">04 de Julho de 2026</p>
          </div>
          <p className="text-[11px] text-white/40 leading-relaxed">
            Preencha o formulário com atenção.<br />
            Ao enviar, seu acesso ao painel<br />
            é criado automaticamente.
          </p>
        </div>
      </div>

      {/* Painel direito — scroll independente */}
      <div className="lg:ml-80 xl:ml-96 min-h-screen bg-[#e8e8e8]">
        {/* Header mobile */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <Image src="/brasao_estado.png" alt="Estado da Bahia" width={32} height={32} />
          <div>
            <p className="text-xs text-gray-500">SABE 2025 — EJA e EPT</p>
            <p className="text-sm font-semibold text-gray-900">Formulário de Inscrição</p>
          </div>
        </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-xs text-amber-800 leading-relaxed mb-6">
          <strong className="block mb-1">Atenção — leia antes de preencher</strong>
          Preencha todos os campos com atenção redobrada, especialmente os dados pessoais, bancários e de deslocamento.
          Informações incorretas poderão ocasionar atrasos no pagamento da ajuda de custo. <strong>Revise antes de enviar.</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DADOS PESSOAIS */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <p className={sectionCls}>Dados Pessoais</p>
            <Field id="nome" label="Nome completo *" erro={erros.nome}>
              <input value={form.nome} onChange={e => set('nome', e.target.value)} className={inputCls} placeholder="Seu nome completo" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="cpf" label="CPF *" erro={erros.cpf}>
                <input value={form.cpf} onChange={e => set('cpf', maskCPF(e.target.value))} maxLength={14} className={inputCls} placeholder="000.000.000-00" />
              </Field>
              <Field id="contato" label="Contato (com DDD) *" erro={erros.contato}>
                <input value={form.contato} onChange={e => set('contato', maskTel(e.target.value))} maxLength={15} className={inputCls} placeholder="(00) 00000-0000" />
              </Field>
            </div>
            <Field id="email" label="E-mail *" erro={erros.email}>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="seu@email.com" />
            </Field>
            <Field id="funcao" label="Função *" erro={erros.funcao}>
              <select value={form.funcao} onChange={e => onFuncaoChange(e.target.value)} className={inputCls}>
                <option value="">Selecione sua função</option>
                <option value="Coordenador Estadual">Coordenador Estadual</option>
                <option value="Subcoordenador Estadual">Subcoordenador Estadual</option>
                <option value="Coordenador Territorial">Coordenador Territorial</option>
              </select>
            </Field>
          </div>

          {/* DADOS TERRITORIAIS — só Coordenador Territorial */}
          {isTerritorial && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <p className={sectionCls}>Dados Territoriais</p>
              <Field id="nte" label="NTE *" erro={erros.nte}>
                <select value={form.nte} onChange={e => onNteChange(e.target.value)} className={inputCls}>
                  <option value="">Selecione o NTE</option>
                  {NTE_LIST.map(n => <option key={n.label} value={n.label}>{n.label}</option>)}
                </select>
              </Field>
              <Field id="municipio" label="Município *" erro={erros.municipio}>
                <select value={form.municipio} onChange={e => set('municipio', e.target.value)} disabled={!form.nte} className={inputCls}>
                  <option value="">{form.nte ? 'Selecione o município' : 'Selecione o NTE primeiro'}</option>
                  {municipios.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
            </div>
          )}

          {/* DESLOCAMENTO — oculto para NTE 26 */}
          {!isNte26 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <p className={sectionCls}>Deslocamento</p>
              <Field id="tipoDeslocamento" label="Tipo de deslocamento *" erro={erros.tipoDeslocamento}>
                <select value={form.tipoDeslocamento} onChange={e => set('tipoDeslocamento', e.target.value)} className={inputCls}>
                  <option value="">Selecione o tipo</option>
                  <option value="Veículo próprio">Veículo próprio</option>
                  <option value="Ônibus">Ônibus</option>
                  <option value="Aéreo">Aéreo</option>
                  <option value="Não precisa de deslocamento">Não precisa de deslocamento</option>
                </select>
              </Field>
              {precisaDesl && (
                <div className="grid grid-cols-2 gap-4">
                  <Field id="quilometragem" label="Quilometragem (Ida + Volta) *" erro={erros.quilometragem}>
                    <input type="number" min={1} value={form.quilometragem} onChange={e => set('quilometragem', e.target.value)} className={inputCls} placeholder="Ex: 340" />
                    <p className="text-xs text-gray-400 mt-1">Distância total ida e volta até Salvador.</p>
                  </Field>
                  <Field id="valorTransporte" label="Valor do transporte (Ida + Volta) *" erro={erros.valorTransporte}>
                    <input value={form.valorTransporte} onChange={e => set('valorTransporte', maskMoeda(e.target.value))} className={inputCls} placeholder="R$ 0,00" />
                    <p className="text-xs text-gray-400 mt-1">Passagem ou nota fiscal de combustível.</p>
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* HOSPEDAGEM — oculto para NTE 26 */}
          {!isNte26 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <p className={sectionCls}>Hospedagem</p>
              <Field id="hospedagem" label="Precisa de hospedagem? *" erro={erros.hospedagem}>
                <select value={form.hospedagem} onChange={e => set('hospedagem', e.target.value)} className={inputCls}>
                  <option value="">Selecione</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Check-in: 03/07 · Check-out: 05/07</p>
              </Field>
            </div>
          )}

          {/* DADOS BANCÁRIOS */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <p className={sectionCls}>Dados Bancários</p>
            <div className="grid grid-cols-2 gap-4">
              <Field id="banco" label="Banco *" erro={erros.banco}>
                <input value={form.banco} onChange={e => set('banco', e.target.value)} className={inputCls} placeholder="Ex: Banco do Brasil" />
              </Field>
              <Field id="tipoConta" label="Tipo de conta *" erro={erros.tipoConta}>
                <select value={form.tipoConta} onChange={e => set('tipoConta', e.target.value)} className={inputCls}>
                  <option value="">Selecione</option>
                  <option value="Corrente">Conta Corrente</option>
                  <option value="Poupança">Conta Poupança</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field id="agencia" label="Agência *" erro={erros.agencia}>
                <input value={form.agencia} onChange={e => set('agencia', e.target.value)} className={inputCls} placeholder="0000" />
              </Field>
              <Field id="conta" label="Conta *" erro={erros.conta}>
                <input value={form.conta} onChange={e => set('conta', e.target.value)} className={inputCls} placeholder="00000-0" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field id="tipoChavePix" label="Tipo de chave PIX *" erro={erros.tipoChavePix}>
                <select value={form.tipoChavePix} onChange={e => set('tipoChavePix', e.target.value)} className={inputCls}>
                  <option value="">Selecione</option>
                  <option value="CPF">CPF</option>
                  <option value="Telefone">Telefone</option>
                  <option value="E-mail">E-mail</option>
                  <option value="Chave aleatória">Chave aleatória</option>
                </select>
              </Field>
              <Field id="chavePix" label="Chave PIX *" erro={erros.chavePix}>
                <input value={form.chavePix} onChange={e => set('chavePix', e.target.value)} className={inputCls} placeholder="Informe a chave" />
              </Field>
            </div>
          </div>

          {erroGeral && (
            <p className="text-sm text-red-600 font-medium text-center">{erroGeral}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm hover:bg-gray-700 transition disabled:opacity-50 shadow-sm">
            {loading ? 'Enviando...' : 'Enviar Inscrição'}
          </button>
        </form>
      </div>
      </div>
    </main>
  )
}
