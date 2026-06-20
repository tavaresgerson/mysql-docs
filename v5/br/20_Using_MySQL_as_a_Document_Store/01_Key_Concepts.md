## 19.1 Conceitos-chave

Esta seção explica os conceitos introduzidos como parte do uso do MySQL como um banco de documentos.

### Documento

Um documento é um conjunto de pares chave-valor, representado por um objeto JSON. Um documento é representado internamente usando o objeto JSON binário do MySQL, através do tipo de dados JSON do MySQL. Os valores dos campos podem conter outros documentos, arrays e listas de documentos.

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

### Coleta

Uma coleção é um recipiente que pode ser usado para armazenar documentos em um banco de dados MySQL.

### Operações CRUD

As operações de criar, ler, atualizar e excluir (CRUD) são as quatro operações básicas que podem ser realizadas em uma coleção ou tabela de banco de dados. Em termos de MySQL, isso significa:

* Criar uma nova entrada (inserção ou adição) * Ler entradas (consultas) * Atualizar entradas * Deletar entradas

### X Plugin

O plugin do MySQL Server que permite a comunicação usando o protocolo X. Suporta clientes que implementam X DevAPI e permite que você use o MySQL como um banco de documentos.

### Protocolo X

Um protocolo para se comunicar com um servidor MySQL que executa o X Plugin. O X Protocol suporta operações CRUD e SQL, autenticação via SASL, permite o streaming (pipelining) de comandos e é extenível no protocolo e na camada de mensagem.