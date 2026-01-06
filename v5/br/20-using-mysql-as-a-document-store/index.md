# Capítulo 19 Usando o MySQL como uma Armazenadora de Documentos

**Índice**

19.1 Conceitos-chave

19.2 Configurando o MySQL como uma Armazenadora de Documentos:   19.2.1 Instalando o Shell do MySQL

```
19.2.2 Starting MySQL Shell
```

19.3 Guia de início rápido: MySQL para Visual Studio

19.4 X Plugin:   19.4.1 Uso de conexões criptografadas com o X Plugin

```
19.4.2 X Plugin Options and Variables

19.4.3 Monitoring X Plugin
```

Este capítulo apresenta uma maneira alternativa de trabalhar com o MySQL como um repositório de documentos, às vezes referido como "uso de NoSQL". Se a sua intenção é usar o MySQL de maneira tradicional (SQL), este capítulo provavelmente não é relevante para você.

Importante

O MySQL Shell 8.0 é a versão mais recente e é altamente recomendada para uso com o MySQL Server 5.7. Por favor, faça o upgrade para o MySQL Shell 8.0. Se você ainda não instalou o MySQL Shell, baixe-o do [site de download](https://dev.mysql.com/downloads/shell). Consulte a documentação do MySQL Shell 8.0 para obter a documentação mais recente. Este capítulo aborda a configuração do servidor MySQL 5.7 como um repositório de documentos e é compatível com clientes da versão 8.0, como o MySQL Shell e os Conectadores MySQL.

Bancos de dados relacionais, como o MySQL, geralmente exigem que um esquema de documento seja definido antes que os documentos possam ser armazenados. As funcionalidades descritas nesta seção permitem que você use o MySQL como um repositório de documentos, que é um sistema de armazenamento sem esquema e, portanto, flexível em termos de esquema, para documentos. Ao usar o MySQL como um repositório de documentos, para criar documentos que descrevem produtos, você não precisa conhecer e definir todos os atributos possíveis de quaisquer produtos antes de armazená-los e operá-los com eles. Isso difere do trabalho com um banco de dados relacional e do armazenamento de produtos em uma tabela, quando todas as colunas da tabela devem ser conhecidas e definidas antes de adicionar quaisquer produtos ao banco de dados. As funcionalidades descritas neste capítulo permitem que você escolha como configurar o MySQL, usando apenas o modelo de repositório de documentos, ou combinando a flexibilidade do modelo de repositório de documentos com o poder do modelo relacional.

Essas seções cobrem o uso do MySQL como um repositório de documentos:

- A seção 19.1, "Conceitos-chave", abrange conceitos como Documento, Coleção, Sessão e Esquema para ajudá-lo a entender como usar o MySQL como um repositório de documentos.

- A seção 19.2, "Configurando o MySQL como uma Armazenadora de Documentos", explica como configurar o X Plugin em um servidor MySQL, para que ele possa funcionar como uma armazenadora de documentos, e como instalar o MySQL Shell para usá-lo como cliente.

- O MySQL Shell 8.0 fornece informações mais detalhadas sobre o uso do MySQL Shell.

- *Guia do usuário X DevAPI.*

  Os clientes que se comunicam com um servidor MySQL usando o protocolo X podem usar o X DevAPI para desenvolver aplicativos. Por exemplo, o MySQL Shell e os Conectores MySQL fornecem essa capacidade ao implementar o X DevAPI. O X DevAPI oferece uma interface de programação moderna com um design simples, mas poderoso, que oferece suporte a conceitos estabelecidos pelos padrões da indústria. Consulte o Guia do Usuário do X DevAPI para tutoriais detalhados sobre o uso do X DevAPI.

- Os seguintes produtos do MySQL suportam o protocolo X e permitem que você use o X DevAPI na sua língua escolhida para desenvolver aplicativos que se comunicam com um servidor MySQL funcionando como um repositório de documentos.

  - O MySQL Shell fornece implementações do X DevAPI em JavaScript e Python.

  - Conector/C++

  - Conector/J

  - Conector/Node.js

  - Conector/NET

  - Conector/Python
