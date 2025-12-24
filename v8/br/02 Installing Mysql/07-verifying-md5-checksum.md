#### 2.1.4.1 Verificação da soma de verificação MD5

Depois de ter baixado um pacote do MySQL, você deve certificar-se de que seu MD5 checksum coincide com o fornecido nas páginas de download do MySQL. Cada pacote tem um checksum individual que você pode verificar contra o pacote que você baixou. O checksum MD5 correto está listado na página de downloads para cada produto do MySQL; você deve compará-lo com o checksum MD5 do arquivo (produto) que você baixou.

Cada sistema operacional e configuração oferece sua própria versão de ferramentas para verificar a soma de verificação MD5. Normalmente, o comando é chamado de `md5sum`, ou pode ser chamado de `md5`, e alguns sistemas operacionais não o enviam. No Linux, ele faz parte do pacote \*\* GNU Text Utilities \*\*, que está disponível para uma ampla gama de plataformas. Você também pode baixar o código-fonte do \[<http://www.gnu.org/software/textutils/>]<http://www.gnu.org/software/textutils/>]. Se você tiver o OpenSSL instalado, você pode usar o comando `openssl md5 package_name` em vez disso. Uma implementação do Windows da linha de comando `md5` está disponível no \[<http://www.michlab.md/summ_four_michlab.md_0>]], ou pode ser chamada de \[\[PH\_CODE\_index\_four\_michlab.md\_summ\_1]], e alguns sistemas operacionais não o enviam. No Linux, ele faz

Linux e Microsoft Windows exemplos:

```bash
$> md5sum mysql-standard-8.4.6-linux-i686.tar.gz
aaab65abbec64d5e907dcd41b8699945  mysql-standard-8.4.6-linux-i686.tar.gz
```

```bash
$> md5.exe mysql-installer-community-8.4.6.msi
aaab65abbec64d5e907dcd41b8699945  mysql-installer-community-8.4.6.msi
```

Verifique se a soma de verificação resultante (a sequência de dígitos hexadecimais) corresponde à que aparece na página de descarregamento imediatamente abaixo da respectiva embalagem.

::: info Note

Certifique-se de verificar a soma de verificação do arquivo de arquivo (por exemplo, o arquivo `.zip`, `.tar.gz`, ou `.msi`) e não dos arquivos contidos no arquivo. Em outras palavras, verifique o arquivo antes de extrair seu conteúdo.

:::
