# Capítulo 19 Usando MySQL como um Document Store

**Sumário**

19.1 Conceitos Chave

19.2 Configurando o MySQL como um Document Store : 19.2.1 Instalando o MySQL Shell

    19.2.2 Iniciando o MySQL Shell

19.3 Guia de Início Rápido: MySQL para Visual Studio

19.4 X Plugin : 19.4.1 Usando Conexões Criptografadas com X Plugin

    19.4.2 Opções e Variáveis do X Plugin

    19.4.3 Monitorando o X Plugin

Este capítulo apresenta uma maneira alternativa de trabalhar com o MySQL como um document store, por vezes referido como “usar NoSQL”. Se sua intenção for usar o MySQL da maneira tradicional (SQL), este capítulo provavelmente não é relevante para você.

Importante

O MySQL Shell 8.0 é a versão mais recente e é altamente recomendado para uso com o MySQL Server 5.7. Por favor, atualize para o MySQL Shell 8.0. Se você ainda não instalou o MySQL Shell, faça o download no [site de download](https://dev.mysql.com/downloads/shell). Consulte a documentação do MySQL Shell 8.0 para obter a documentação mais recente. Este capítulo aborda a configuração do servidor MySQL 5.7 como um document store e é compatível com clientes da versão 8.0, como o MySQL Shell e os MySQL Connectors.

Bancos de dados relacionais, como o MySQL, geralmente exigem que um *schema* de documento seja definido antes que os documentos possam ser armazenados. Os recursos descritos nesta seção permitem que você use o MySQL como um document store, que é um sistema de armazenamento sem *schema* (schema-less) e, portanto, flexível em relação ao *schema* (schema-flexible), para documentos. Ao usar o MySQL como um document store, para criar documentos descrevendo produtos, você não precisa saber e definir todos os atributos possíveis de quaisquer produtos antes de armazená-los e operar com eles. Isso difere de trabalhar com um banco de dados relacional e armazenar produtos em uma *table*, onde todas as *columns* da *table* devem ser conhecidas e definidas antes de adicionar quaisquer produtos ao *database*. Os recursos descritos neste capítulo permitem que você escolha como configurar o MySQL, usando apenas o modelo de *document store* ou combinando a flexibilidade do modelo de *document store* com o poder do modelo relacional.

Estas seções abordam o uso do MySQL como um document store:

* O Seção 19.1, “Conceitos Chave” aborda conceitos como Document, Collection, Session e Schema para ajudar você a entender como usar o MySQL como um document store.

* O Seção 19.2, “Configurando o MySQL como um Document Store” explica como configurar o X Plugin em um MySQL Server, para que ele possa funcionar como um document store, e como instalar o MySQL Shell para usar como um cliente.

* O MySQL Shell 8.0 fornece informações mais detalhadas sobre o uso do MySQL Shell.

* *X DevAPI User guide.*

  Clientes que se comunicam com um MySQL Server usando o X Protocol podem usar o X DevAPI para desenvolver aplicações. Por exemplo, o MySQL Shell e os MySQL Connectors fornecem essa capacidade ao implementar o X DevAPI. O X DevAPI oferece uma interface de programação moderna com um design simples, mas poderoso, que fornece suporte para conceitos estabelecidos pelo padrão da indústria. Consulte o X DevAPI User Guide para tutoriais detalhados sobre o uso do X DevAPI.

* Os seguintes produtos MySQL suportam o X Protocol e permitem que você use o X DevAPI em sua linguagem escolhida para desenvolver aplicações que se comunicam com um MySQL Server funcionando como um document store.

  + MySQL Shell fornece implementações de X DevAPI em JavaScript e Python.

  + Connector/C++
  + Connector/J
  + Connector/Node.js
  + Connector/NET
  + Connector/Python
