# Capítulo 30 Schema sys de MySQL

O MySQL 8.0 inclui o esquema `sys`, um conjunto de objetos que ajuda os administradores de banco de dados e desenvolvedores a interpretar dados coletados pelo Gerador de Desempenho. Os objetos do esquema `sys` podem ser usados para casos típicos de ajuste e diagnóstico. Os objetos neste esquema incluem:

* Visões que resumem os dados do Performance Schema em uma forma mais fácil de entender.

* Procedimentos armazenados que realizam operações como configuração do Gerador de Desempenho e geração de relatórios de diagnóstico.

* Funções armazenadas que consultam a configuração do Gerador de Desempenho e fornecem serviços de formatação.

Para novas instalações, o esquema `sys` é instalado por padrão durante a inicialização do diretório de dados se você usar o **mysqld** com a opção `--initialize` ou `--initialize-insecure`. Se isso não for desejado, você pode descartar o esquema `sys` manualmente após a inicialização, se ele não for necessário.

O procedimento de atualização do MySQL produz um erro se um esquema `sys` existir, mas não tiver nenhuma visão `version`, assumindo que a ausência dessa visão indica um esquema `sys` criado pelo usuário. Para fazer a atualização neste caso, remova ou renomeie primeiro o esquema existente `sys`.

Os objetos do esquema `sys` têm um `DEFINER` de `'mysql.sys'@'localhost'`. O uso da conta dedicada `mysql.sys` evita problemas que ocorrem se um DBA renomear ou remover a conta `root`.