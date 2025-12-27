#### 17.6.3.7 Desativação da Validação de Caminhos de Espaço de Tabela

Ao inicializar, o `InnoDB` examina os diretórios definidos pela variável `innodb_directories` em busca de arquivos de espaço de tabela. Os caminhos dos arquivos de espaço de tabela descobertos são validados em relação aos caminhos registrados no dicionário de dados. Se os caminhos não corresponderem, os caminhos no dicionário de dados são atualizados.

A variável `innodb_validate_tablespace_paths` permite desativar a validação de caminhos de espaço de tabela. Esse recurso é destinado a ambientes onde os arquivos de espaço de tabela não são movidos. Desativar a validação de caminhos melhora o tempo de inicialização em sistemas com um grande número de arquivos de espaço de tabela. Se `log_error_verbosity` for definido como 3, a seguinte mensagem é impressa ao inicializar quando a validação de caminhos de espaço de tabela é desativada:

```
[InnoDB] Skipping InnoDB tablespace path validation.
Manually moved tablespace files will not be detected!
```

Aviso

Iniciar o servidor com a validação de caminhos de espaço de tabela desativada após mover arquivos de espaço de tabela pode levar a comportamentos indefinidos.