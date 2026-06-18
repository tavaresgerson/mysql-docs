#### 17.6.3.7 Desativar a validação do caminho do espaço de tabela

Ao inicializar, `InnoDB` examina os diretórios definidos pela variável `innodb_directories` em busca de arquivos de espaço de tabela. Os caminhos dos arquivos de espaço de tabela descobertos são validados em relação aos caminhos registrados no dicionário de dados. Se os caminhos não corresponderem, os caminhos no dicionário de dados são atualizados.

A variável `innodb_validate_tablespace_paths`, introduzida no MySQL 8.0.21, permite desabilitar a validação do caminho do tablespace. Esse recurso é destinado a ambientes onde os arquivos do tablespace não são movidos. A desativação da validação de caminho melhora o tempo de inicialização em sistemas com um grande número de arquivos do tablespace. Se `log_error_verbosity` estiver definido como 3, a seguinte mensagem será impressa durante a inicialização quando a validação do caminho do tablespace for desativada:

```
[InnoDB] Skipping InnoDB tablespace path validation.
Manually moved tablespace files will not be detected!
```

Aviso

Iniciar o servidor com a validação do caminho do espaço de tabelas desativada após a movimentação dos arquivos do espaço de tabelas pode causar comportamentos indefinidos.
