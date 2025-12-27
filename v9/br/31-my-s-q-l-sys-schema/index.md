# Capítulo 30 Schema sys MySQL

**Índice**

30.1 Pré-requisitos para o uso do schema sys

30.2 Uso do schema sys

30.3 Relatório de progresso do schema sys

30.4 Referência de objetos do schema sys:   30.4.1 Índice de objetos do schema sys

    30.4.2 Tabelas e gatilhos do schema sys

    30.4.3 Visualizações do schema sys

    30.4.4 Procedimentos armazenados do schema sys

    30.4.5 Funções armazenadas do schema sys

O MySQL 9.5 inclui o schema `sys`, um conjunto de objetos que ajuda os administradores de banco de dados (DBAs) e desenvolvedores a interpretar os dados coletados pelo Schema de Desempenho. Os objetos do schema `sys` podem ser usados para casos típicos de ajuste e diagnóstico. Os objetos neste schema incluem:

* Visualizações que resumem os dados do Schema de Desempenho em uma forma mais fácil de entender.

* Procedimentos armazenados que realizam operações como a configuração do Schema de Desempenho e a geração de relatórios de diagnóstico.

* Funções armazenadas que consultam a configuração do Schema de Desempenho e fornecem serviços de formatação.

Para instalações novas, o schema `sys` é instalado por padrão durante a inicialização do diretório de dados se você usar o **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Se isso não for desejado, você pode excluir o schema `sys` manualmente após a inicialização, se ele não for necessário.

O procedimento de atualização do MySQL produz um erro se um schema `sys` existir, mas não tiver a visão `version`, assumindo que a ausência dessa visão indica um schema `sys` criado pelo usuário. Para atualizar nesse caso, remova ou renomeie primeiro o schema `sys` existente.

Os objetos do schema `sys` têm um `DEFINER` de `'mysql.sys'@'localhost'`. O uso da conta dedicada `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`.