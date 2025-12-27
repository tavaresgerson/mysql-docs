### 22.5.2 Desativando o Plugin X

O Plugin X pode ser desativado durante o início da execução, definindo `mysqlx=0` no arquivo de configuração do MySQL ou passando `--mysqlx=0` ou `--skip-mysqlx` ao iniciar o servidor MySQL.

Alternativamente, use a opção `-DWITH_MYSQLX=OFF` do CMake para compilar o MySQL Server sem o Plugin X.