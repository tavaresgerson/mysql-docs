### 2.10.3 Problemas com a interface Perl DBI/DBD

Se o Perl relata que não consegue encontrar o módulo `../mysql/mysql.so`, o problema é provavelmente que o Perl não consegue localizar a biblioteca compartilhada `libmysqlclient.so`. Você deve ser capaz de corrigir esse problema por um dos seguintes métodos:

- Copie `libmysqlclient.so` para o diretório onde suas outras bibliotecas compartilhadas estão localizadas (provavelmente `/usr/lib` ou `/lib`).
- Modifique as opções `-L` usadas para compilar `DBD::mysql` para refletir a localização real de `libmysqlclient.so`.
- No Linux, você pode adicionar o nome do caminho do diretório onde `libmysqlclient.so` está localizado no arquivo `/etc/ld.so.conf`.
- Adicione o nome do caminho do diretório onde está localizado o `libmysqlclient.so` à variável de ambiente `LD_RUN_PATH`. Alguns sistemas usam o `LD_LIBRARY_PATH` em vez disso.

Observe que você também pode precisar modificar as opções `-L` se houver outras bibliotecas que o linker não consegue encontrar. Por exemplo, se o linker não consegue encontrar `libc` porque está em `/lib` e o comando de link especifica `-L/usr/lib`, altere a opção `-L` para `-L/lib` ou adicione `-L/lib` ao comando de link existente.

Se você receber os seguintes erros de `DBD::mysql`, você provavelmente está usando **gcc** (ou usando um antigo binário compilado com **gcc**):

```
/usr/bin/perl: can't resolve symbol '__moddi3'
/usr/bin/perl: can't resolve symbol '__divdi3'
```

Adicione `-L/usr/lib/gcc-lib/... -lgcc` ao comando de link quando a `mysql.so` biblioteca for construída (verifique a saída de **make** para `mysql.so` quando você compilar o cliente Perl). A `-L` opção deve especificar o nome do caminho do diretório onde `libgcc.a` está localizado em seu sistema.

Outra causa deste problema pode ser que o Perl e o MySQL não são ambos compilados com **gcc**. Neste caso, você pode resolver a incompatibilidade compilando ambos com **gcc**.
