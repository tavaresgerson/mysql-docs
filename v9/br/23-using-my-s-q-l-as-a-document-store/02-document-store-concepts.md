## Conceitos de Armazenamento de Documentos

Esta seção explica os conceitos introduzidos como parte do uso do MySQL como um armazenamento de documentos.

* Documento JSON
* Coleção
* Operações CRUD

### Documento JSON

Um documento JSON é uma estrutura de dados composta por pares chave-valor e é a estrutura fundamental para o uso do MySQL como um armazenamento de documentos. Por exemplo, o esquema world_x (instalado mais tarde neste capítulo) contém este documento:

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

Este documento mostra que os valores das chaves podem ser tipos de dados simples, como inteiros ou strings, mas também podem conter outros documentos, arrays e listas de documentos. Por exemplo, o valor da chave `geography` consiste em vários pares chave-valor. Um documento JSON é representado internamente usando o objeto JSON binário do MySQL, através do tipo de dado `JSON` do MySQL.

As diferenças mais importantes entre um documento e as tabelas conhecidas das bases de dados relacionais tradicionais são que a estrutura de um documento não precisa ser definida antecipadamente e uma coleção pode conter vários documentos com estruturas diferentes. As tabelas relacionais, por outro lado, exigem que sua estrutura seja definida e todas as linhas da tabela devem conter as mesmas colunas.

### Coleção

Uma coleção é um contêiner usado para armazenar documentos JSON em um banco de dados MySQL. As aplicações geralmente executam operações contra uma coleção de documentos, por exemplo, para encontrar um documento específico.

### Operações CRUD

As quatro operações básicas que podem ser emitidas contra uma coleção são Criar, Ler, Atualizar e Deletar (CRUD). Em termos do MySQL, isso significa:

* Criar um novo documento (inserção ou adição)
* Ler um ou mais documentos (consultas)
* Atualizar um ou mais documentos
* Deletar um ou mais documentos