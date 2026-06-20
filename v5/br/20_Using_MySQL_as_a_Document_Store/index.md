# Capítulo 19 Usando o MySQL como um repositório de documentos

Este capítulo apresenta uma maneira alternativa de trabalhar com MySQL como um banco de documentos, às vezes referido como "usar NoSQL". Se a sua intenção é usar MySQL de uma maneira tradicional (SQL), este capítulo provavelmente não é relevante para você.

Importante

O MySQL Shell 8.0 é a versão mais recente e é altamente recomendada para uso com o MySQL Server 5.7. Por favor, faça o upgrade para o MySQL Shell 8.0. Se você ainda não instalou o MySQL Shell, baixe-o do site de download [(https://dev.mysql.com/downloads/shell)]. Consulte a documentação do [MySQL Shell 8.0][(/doc/mysql-shell/8.0/en/)] para obter a documentação mais recente. Este capítulo abrange a configuração do servidor MySQL 5.7 como uma loja de documentos e é compatível com clientes da versão 8.0, como o MySQL Shell e os Conectadores MySQL.

Banco de dados relacionais, como o MySQL, geralmente exigem que um esquema de documento seja definido antes que os documentos possam ser armazenados. As características descritas nesta seção permitem que você use o MySQL como um banco de documentos, que é um sistema de armazenamento sem esquema e, portanto, flexível em relação ao esquema, para documentos. Ao usar o MySQL como um banco de documentos, para criar documentos que descrevem produtos, você não precisa saber e definir todos os atributos possíveis de quaisquer produtos antes de armazená-los e operá-los. Isso difere de trabalhar com um banco de dados relacional e armazenar produtos em uma tabela, quando todas as colunas da tabela devem ser conhecidas e definidas antes de adicionar quaisquer produtos ao banco de dados. As características descritas neste capítulo permitem que você escolha como configurar o MySQL, usando apenas o modelo de banco de documentos, ou combinando a flexibilidade do modelo de banco de documentos com o poder do modelo relacional.

Essas seções cobrem o uso do MySQL como um banco de documentos:

* A seção [Seção 19.1, “Conceitos-chave”][(document-store-concepts.html "19.1 Key Concepts")] abrange conceitos como Documento, Coleção, Sessão e Esquema para ajudá-lo a entender como usar o MySQL como um banco de dados de documentos.

A seção [Seção 19.2, “Configurando o MySQL como um repositório de documentos”][(document-store-setting-up.html "19.2 Setting Up MySQL as a Document Store")] explica como configurar o X Plugin em um servidor MySQL, para que ele possa funcionar como um repositório de documentos e como instalar o MySQL Shell para usá-lo como um cliente.

* [MySQL Shell 8.0][(/doc/mysql-shell/8.0/en/)] fornece informações mais detalhadas sobre o uso do MySQL Shell.

*Guia do usuário do X DevAPI.*

Os clientes que se comunicam com um servidor MySQL usando o Protocolo X podem usar o X DevAPI para desenvolver aplicativos. Por exemplo, o MySQL Shell e os Conectadores MySQL fornecem essa capacidade ao implementar o X DevAPI. O X DevAPI oferece uma interface de programação moderna com um design simples, mas poderoso, que oferece suporte a conceitos estabelecidos de padrão da indústria. Consulte o [Guia do Usuário X DevAPI][(/doc/x-devapi-userguide/en/)] para tutoriais detalhados sobre o uso do X DevAPI.

* Os seguintes produtos do MySQL suportam o protocolo X e permitem que você use o X DevAPI em seu idioma escolhido para desenvolver aplicações que se comunicam com um servidor MySQL funcionando como um banco de documentos.

+ O MySQL Shell oferece implementações do X DevAPI em JavaScript e Python.

+ Conector/C++
+ Conector/J
+ Conector/Node.js
+ Conector/NET
+ Conector/Python