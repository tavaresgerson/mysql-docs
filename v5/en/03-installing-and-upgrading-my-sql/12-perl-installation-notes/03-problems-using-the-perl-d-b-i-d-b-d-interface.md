### 2.12.3 Problemas ao Usar a Interface Perl DBI/DBD

Se o Perl relatar que não consegue encontrar o módulo `../mysql/mysql.so`, o problema é provavelmente que o Perl não consegue localizar a shared library `libmysqlclient.so`. Você deve conseguir corrigir este problema por meio de um dos seguintes métodos:

* Copie `libmysqlclient.so` para o diretório onde suas outras shared libraries estão localizadas (provavelmente `/usr/lib` ou `/lib`).

* Modifique as opções `-L` usadas para compilar `DBD::mysql` para refletir a localização real de `libmysqlclient.so`.

* No Linux, você pode adicionar o nome do caminho (path name) do diretório onde `libmysqlclient.so` está localizado ao arquivo `/etc/ld.so.conf`.

* Adicione o nome do caminho (path name) do diretório onde `libmysqlclient.so` está localizado à variável de ambiente `LD_RUN_PATH`. Alguns sistemas usam `LD_LIBRARY_PATH` em vez disso.

Observe que você também pode precisar modificar as opções `-L` se houver outras libraries que o linker não consiga encontrar. Por exemplo, se o linker não conseguir encontrar `libc` porque está em `/lib` e o comando link especifica `-L/usr/lib`, altere a opção `-L` para `-L/lib` ou adicione `-L/lib` ao comando link existente.

Se você receber os seguintes erros do `DBD::mysql`, você provavelmente está usando **gcc** (ou usando um binário antigo compilado com **gcc**):

```sql
/usr/bin/perl: can't resolve symbol '__moddi3'
/usr/bin/perl: can't resolve symbol '__divdi3'
```

Adicione `-L/usr/lib/gcc-lib/... -lgcc` ao comando link quando a library `mysql.so` for construída (verifique a saída do **make** para `mysql.so` ao compilar o cliente Perl). A opção `-L` deve especificar o nome do caminho (path name) do diretório onde `libgcc.a` está localizado no seu sistema.

Outra causa deste problema pode ser que o Perl e o MySQL não foram ambos compilados com **gcc**. Neste caso, você pode resolver a incompatibilidade compilando ambos com **gcc**.