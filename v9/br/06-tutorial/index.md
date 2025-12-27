# Capítulo 5 - Tutoriais

**Índice**

5.1 Conectando-se e Desconectando-se do Servidor

5.2 Entrando em Consultas

5.3 Criando e Usando um Banco de Dados:   5.3.1 Criando e Selecionando um Banco de Dados

    5.3.2 Criando uma Tabela

    5.3.3 Carregando Dados em uma Tabela

    5.3.4 Recuperando Informações de uma Tabela

5.4 Obtendo Informações sobre Bancos de Dados e Tabelas

5.5 Usando o mysql no Modo Batch

5.6 Exemplos de Consultas Comuns:   5.6.1 O Valor Máximo para uma Coluna

    5.6.2 A Linha que Contém o Máximo de uma Cálculo Específica

    5.6.3 Máximo de Coluna por Grupo

    5.6.4 As Linhas que Contêm o Máximo por Grupo de uma Cálculo Específica

    5.6.5 Usando Variáveis Definidas pelo Usuário

    5.6.6 Usando Chaves Estrangeiras

    5.6.7 Pesquisando em Duas Chaves

    5.6.8 Calculando Visitas por Dia

    5.6.9 Usando AUTO_INCREMENT

5.7 Usando o MySQL com o Apache

Este capítulo fornece uma introdução tutorial ao MySQL, mostrando como usar o programa cliente **mysql** para criar e usar um banco de dados simples. **mysql** (às vezes referido como o "monitor de terminal" ou apenas "monitor") é um programa interativo que permite conectar-se a um servidor MySQL, executar consultas e visualizar os resultados. **mysql** também pode ser usado no modo batch: você coloca suas consultas em um arquivo previamente, depois diz ao **mysql** para executar o conteúdo do arquivo. Ambas as maneiras de usar **mysql** são abordadas aqui.

Para ver uma lista de opções fornecidas pelo **mysql**, invocá-lo com a opção `--help`:

```
$> mysql --help
```

Este capítulo assume que o **mysql** está instalado na sua máquina e que um servidor MySQL está disponível ao qual você pode se conectar. Se isso não for verdade, entre em contato com o administrador do MySQL. (Se você é o administrador, precisa consultar as partes relevantes deste manual, como o Capítulo 7, *Administração do Servidor MySQL*.)

Este capítulo descreve todo o processo de configuração e uso de um banco de dados. Se você estiver interessado apenas em acessar um banco de dados existente, pode querer pular as seções que descrevem como criar o banco de dados e as tabelas que ele contém.

Como este capítulo é de natureza tutorial, muitos detalhes são necessariamente omitidos. Consulte as seções relevantes do manual para obter mais informações sobre os tópicos abordados aqui.