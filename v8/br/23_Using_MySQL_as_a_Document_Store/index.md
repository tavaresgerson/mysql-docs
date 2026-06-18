# Capítulo 22 Usando o MySQL como uma Armazenadora de Documentos

**Índice**

22.1 Interfaces para uma Armazenagem de Documentos MySQL

22.2 Conceitos de Armazenamento de Documentos

22.3 Guia de início rápido do JavaScript: Shell MySQL para Armazenamento de Documentos:   22.3.1 Shell MySQL

```
22.3.2 Download and Import world_x Database

22.3.3 Documents and Collections

22.3.4 Relational Tables

22.3.5 Documents in Tables
```

22.4 Guia Rápido do Python: Shell MySQL para Armazenamento de Documentos:   22.4.1 Shell MySQL

```
22.4.2 Download and Import world_x Database

22.4.3 Documents and Collections

22.4.4 Relational Tables

22.4.5 Documents in Tables
```

22.5 X Plugin:   22.5.1 Verificar a instalação do X Plugin

```
22.5.2 Disabling X Plugin

22.5.3 Using Encrypted Connections with X Plugin

22.5.4 Using X Plugin with the Caching SHA-2 Authentication Plugin

22.5.5 Connection Compression with X Plugin

22.5.6 X Plugin Options and Variables

22.5.7 Monitoring X Plugin
```

Este capítulo apresenta uma maneira alternativa de trabalhar com o MySQL como um repositório de documentos, às vezes referido como "uso de NoSQL". Se a sua intenção é usar o MySQL de maneira tradicional (SQL), este capítulo provavelmente não é relevante para você.

Tradicionalmente, bancos de dados relacionais, como o MySQL, geralmente exigiam que um esquema fosse definido antes que os documentos pudessem ser armazenados. As funcionalidades descritas nesta seção permitem que você use o MySQL como um repositório de documentos, que é um sistema de armazenamento sem esquema e, portanto, flexível em termos de esquema, para documentos. Por exemplo, ao criar documentos que descrevem produtos, você não precisa conhecer e definir todos os atributos possíveis de quaisquer produtos antes de armazenar e operar com os documentos. Isso difere do trabalho com um banco de dados relacional e do armazenamento de produtos em uma tabela, quando todas as colunas da tabela devem ser conhecidas e definidas antes de adicionar quaisquer produtos ao banco de dados. As funcionalidades descritas neste capítulo permitem que você escolha como configurar o MySQL, usando apenas o modelo de repositório de documentos ou combinando a flexibilidade do modelo de repositório de documentos com o poder do modelo relacional.

Para usar o MySQL como um repositório de documentos, você utiliza as seguintes funcionalidades do servidor:

- O X Plugin permite que o MySQL Server se comunique com clientes usando o Protocolo X, o que é um pré-requisito para usar o MySQL como um repositório de documentos. O X Plugin está habilitado por padrão no MySQL Server a partir do MySQL 8.0. Para obter instruções sobre como verificar a instalação do X Plugin e configurá-lo e monitorá-lo, consulte a Seção 22.5, “X Plugin”.

- O X Protocol suporta operações CRUD e SQL, autenticação via SASL, permite o fluxo (pipelining) de comandos e é extenível no nível do protocolo e da mensagem. Os clientes compatíveis com o X Protocol incluem o MySQL Shell e os Conectores MySQL 8.0.

- Clientes que se comunicam com um servidor MySQL usando o Protocolo X podem usar o X DevAPI para desenvolver aplicativos. O X DevAPI oferece uma interface de programação moderna com um design simples, mas poderoso, que oferece suporte a conceitos estabelecidos pelos padrões da indústria. Este capítulo explica como começar a usar a implementação do X DevAPI em JavaScript ou Python no MySQL Shell como cliente. Consulte o Guia do Usuário do X DevAPI para tutoriais detalhados sobre o uso do X DevAPI.
