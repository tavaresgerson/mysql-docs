## 22.2 Conceitos de Loja de Documentos

Esta seção explica os conceitos introduzidos como parte do uso do MySQL como um banco de documentos.

* Documento JSON
* Coleção
* Operações CRUD

### Documento JSON

Um documento JSON é uma estrutura de dados composta por pares chave-valor e é a estrutura fundamental para usar o MySQL como banco de dados de documentos. Por exemplo, o esquema world_x (instalado mais tarde neste capítulo) contém este documento:

```
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

Este documento mostra que os valores das chaves podem ser tipos de dados simples, como inteiros ou strings, mas também podem conter outros documentos, matrizes e listas de documentos. Por exemplo, o valor da chave `geography` consiste em múltiplos pares chave-valor. Um documento JSON é representado internamente usando o objeto JSON binário do MySQL, através do tipo de dados `JSON` do MySQL.

As diferenças mais importantes entre um documento e as tabelas conhecidas dos bancos de dados relacionais tradicionais são que a estrutura de um documento não precisa ser definida antecipadamente, e uma coleção pode conter vários documentos com estruturas diferentes. As tabelas relacionais, por outro lado, exigem que sua estrutura seja definida, e todas as linhas da tabela devem conter as mesmas colunas.

### Coleta

Uma coleção é um recipiente que é usado para armazenar documentos JSON em um banco de dados MySQL. As aplicações geralmente executam operações contra uma coleção de documentos, por exemplo, para encontrar um documento específico.

### Operações CRUD

As quatro operações básicas que podem ser realizadas em uma coleção são Criar, Ler, Atualizar e Deletar (CRUD). Em termos de MySQL, isso significa:

* Crie um novo documento (inserção ou adição) * Leia um ou mais documentos (consultas) * Atualize um ou mais documentos * Exclua um ou mais documentos