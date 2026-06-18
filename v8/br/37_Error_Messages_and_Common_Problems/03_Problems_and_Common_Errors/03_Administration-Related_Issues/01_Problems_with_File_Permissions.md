#### B.3.3.1 Problemas com permissões de arquivo

Se você tiver problemas com permissões de arquivos, a variável de ambiente `UMASK` ou `UMASK_DIR` pode estar configurada incorretamente quando o **mysqld** é iniciado. Por exemplo, o **mysqld** pode emitir a seguinte mensagem de erro ao criar uma tabela:

```
ERROR: Can't find file: 'path/with/file_name' (Errcode: 13)
```

Os valores padrão `UMASK` e `UMASK_DIR` são `0640` e `0750`, respectivamente. O **mysqld** assume que o valor para `UMASK` ou `UMASK_DIR` é octal se começar com um zero. Por exemplo, definir `UMASK=0600` é equivalente a `UMASK=384`, pois 0600 octal é 384 decimal.

Supondo que você iniciar o **mysqld** usando o **mysqld\_safe**, altere o valor padrão do `UMASK` da seguinte forma:

```
UMASK=384  # = 600 in octal
export UMASK
mysqld_safe &
```

Nota

Uma exceção se aplica ao arquivo de log de erro se você iniciar o **mysqld** usando o **mysqld\_safe**, que não respeita `UMASK`: o **mysqld\_safe** pode criar o arquivo de log de erro se ele não existir antes de iniciar o **mysqld**, e o **mysqld\_safe** usa uma máscara de permissão configurada para um valor rigoroso de `0137`. Se isso não for adequado, crie o arquivo de erro manualmente com o modo de acesso desejado antes de executar o **mysqld\_safe**.

Por padrão, o **mysqld** cria diretórios de banco de dados com um valor de permissão de acesso de `0750`. Para modificar esse comportamento, defina a variável `UMASK_DIR`. Se você definir seu valor, novos diretórios serão criados com os valores combinados de `UMASK` e `UMASK_DIR`. Por exemplo, para dar acesso ao grupo a todos os novos diretórios, inicie o **mysqld\_safe** da seguinte forma:

```
UMASK_DIR=504  # = 770 in octal
export UMASK_DIR
mysqld_safe &
```

Para obter detalhes adicionais, consulte a Seção 6.9, “Variáveis de Ambiente”.
