### 2.12.3 Problemas ao usar a interface Perl DBI/DBD

Se o Perl informar que não consegue encontrar o módulo `../mysql/mysql.so`, o problema provavelmente é que o Perl não consegue localizar a biblioteca compartilhada `libmysqlclient.so`. Você deve ser capaz de resolver esse problema por um dos seguintes métodos:

- Copie `libmysqlclient.so` para o diretório onde estão localizadas suas outras bibliotecas compartilhadas (provavelmente `/usr/lib` ou `/lib`).

- Modifique as opções `-L` usadas para compilar `DBD::mysql` para refletir a localização real do `libmysqlclient.so`.

- No Linux, você pode adicionar o nome do caminho do diretório onde o `libmysqlclient.so` está localizado ao arquivo `/etc/ld.so.conf`.

- Adicione o nome do caminho do diretório onde o `libmysqlclient.so` está localizado à variável de ambiente `LD_RUN_PATH`. Alguns sistemas usam `LD_LIBRARY_PATH` em vez disso.

Observe que você também pode precisar modificar as opções `-L` se houver outras bibliotecas que o link não conseguir encontrar. Por exemplo, se o link não conseguir encontrar `libc` porque ela está em `/lib` e o comando de link especifica `-L/usr/lib`, mude a opção `-L` para `-L/lib` ou adicione `-L/lib` ao comando de link existente.

Se você receber os seguintes erros do `DBD::mysql`, provavelmente está usando o **gcc** (ou está usando um binário antigo compilado com o **gcc**):

```sql
/usr/bin/perl: can't resolve symbol '__moddi3'
/usr/bin/perl: can't resolve symbol '__divdi3'
```

Adicione `-L/usr/lib/gcc-lib/... -lgcc` ao comando de link quando a biblioteca `mysql.so` for compilada (verifique a saída do **make** para `mysql.so` ao compilar o cliente Perl). A opção `-L` deve especificar o nome do caminho do diretório onde `libgcc.a` está localizado no seu sistema.

Outra causa desse problema pode ser que Perl e MySQL não estejam ambos compilados com **gcc**. Nesse caso, você pode resolver a incompatibilidade compilando ambos com **gcc**.
