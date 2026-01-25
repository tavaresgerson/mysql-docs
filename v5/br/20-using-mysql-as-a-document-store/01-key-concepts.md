## 19.1 Conceitos Chave

Esta seção explica os conceitos introduzidos como parte do uso do MySQL como um document store.

### Documento

Um Documento é um conjunto de pares chave-valor, conforme representado por um objeto JSON. Internamente, um Documento é representado usando o objeto JSON binário do MySQL, através do datatype JSON do MySQL. Os valores dos campos podem conter outros documentos, arrays e listas de documentos.

```sql
{
    "GNP": 4834,
    "_id": "00005de917d80000000000000023",
    "Code": "BWA",
    "Name": "Botswana",
    "IndepYear": 1966,
    "geography": {
        "Region": "Southern Africa",
        "Continent": "Africa",
        "SurfaceArea": 581730
    },
    "government": {
        "HeadOfState": "Festus G. Mogae",
        "GovernmentForm": "Republic"
    },
    "demographics": {
        "Population": 1622000,
        "LifeExpectancy": 39.29999923706055
    }
}
```

### Coleção

Uma Coleção é um container que pode ser usado para armazenar Documentos em um Database MySQL.

### Operações CRUD

As operações Create, Read, Update e Delete (CRUD) são as quatro operações básicas que podem ser executadas em uma Coleção ou Table do database. Em termos de MySQL, isso significa:

* Criar uma nova entrada (inserção ou adição)
* Ler entradas (Queries)
* Atualizar entradas
* Excluir entradas

### X Plugin

O Plugin do MySQL Server que permite a comunicação usando o X Protocol. Suporta clients que implementam o X DevAPI e permite usar o MySQL como um document store.

### X Protocol

Um Protocolo para comunicação com um MySQL Server executando o X Plugin. O X Protocol suporta operações CRUD e SQL, autenticação via SASL, permite o streaming (pipelining) de comandos e é extensível na camada de protocolo e de mensagem.