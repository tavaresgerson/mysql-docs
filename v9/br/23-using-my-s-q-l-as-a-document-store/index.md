# Capítulo 22 Usando o MySQL como uma Armazenadora de Documentos

**Índice**

22.1 Interfaces para uma Armazenadora de Documentos MySQL

22.2 Conceitos da Armazenadora de Documentos

22.3 Guia Rápido em JavaScript: Shell MySQL para Armazenadora de Documentos :   22.3.1 Shell MySQL

    22.3.2 Baixar e Importar o banco de dados world\_x

    22.3.3 Documentos e Coleções

    22.3.4 Tabelas Relacionais

    22.3.5 Documentos em Tabelas

22.4 Guia Rápido em Python: Shell MySQL para Armazenadora de Documentos :   22.4.1 Shell MySQL

    22.4.2 Baixar e Importar o banco de dados world\_x

    22.4.3 Documentos e Coleções

    22.4.4 Tabelas Relacionais

    22.4.5 Documentos em Tabelas

22.5 X Plugin :   22.5.1 Verificar a Instalação do X Plugin

    22.5.2 Desabilitar o X Plugin

    22.5.3 Usar Conexões Encriptadas com o X Plugin

    22.5.4 Usar o X Plugin com o Plugin de Autenticação Caching SHA-2

    22.5.5 Compressão de Conexão com o X Plugin

    22.5.6 Opções e Variáveis do X Plugin

    22.5.7 Monitorar o X Plugin

Este capítulo apresenta uma maneira alternativa de trabalhar com o MySQL como uma armazenadora de documentos, às vezes referida como “usar NoSQL”. Se a sua intenção é usar o MySQL de forma tradicional (SQL), este capítulo provavelmente não é relevante para você.

Tradicionalmente, bancos de dados relacionais, como o MySQL, geralmente exigiam que um esquema fosse definido antes que os documentos pudessem ser armazenados. As funcionalidades descritas nesta seção permitem que você use o MySQL como um repositório de documentos, que é um sistema de armazenamento sem esquema e, portanto, flexível em termos de esquema, para documentos. Por exemplo, ao criar documentos que descrevem produtos, você não precisa conhecer e definir todos os atributos possíveis de quaisquer produtos antes de armazenar e operar com os documentos. Isso difere do trabalho com um banco de dados relacional e do armazenamento de produtos em uma tabela, quando todas as colunas da tabela devem ser conhecidas e definidas antes de adicionar quaisquer produtos ao banco de dados. As funcionalidades descritas neste capítulo permitem que você escolha como configurar o MySQL, usando apenas o modelo de repositório de documentos, ou combinando a flexibilidade do modelo de repositório de documentos com o poder do modelo relacional.

Para usar o MySQL como um repositório de documentos, você usa as seguintes funcionalidades do servidor:

* O X Plugin permite que o MySQL Server se comunique com clientes usando o Protocolo X, que é um pré-requisito para usar o MySQL como um repositório de documentos. O X Plugin está habilitado por padrão no MySQL Server a partir do MySQL 9.5. Para instruções sobre como verificar a instalação do X Plugin e como configurar e monitorar o X Plugin, consulte a Seção 22.5, “X Plugin”.

* O Protocolo X suporta operações CRUD e SQL, autenticação via SASL, permite o fluxo (pipelining) de comandos e é extenível no protocolo e na camada de mensagem. Os clientes compatíveis com o Protocolo X incluem o MySQL Shell e os Conectadores MySQL 9.5.

* Clientes que se comunicam com um servidor MySQL usando o Protocolo X podem usar o X DevAPI para desenvolver aplicações. O X DevAPI oferece uma interface de programação moderna com um design simples, mas poderoso, que oferece suporte a conceitos estabelecidos pelos padrões da indústria. Este capítulo explica como começar a usar a implementação do X DevAPI em JavaScript ou Python no MySQL Shell como cliente. Consulte o Guia do Usuário do X DevAPI para tutoriais detalhados sobre o uso do X DevAPI.