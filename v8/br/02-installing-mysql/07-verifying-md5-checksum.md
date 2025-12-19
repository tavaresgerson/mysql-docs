#### 2.1.4.1 Verificação da soma de verificação MD5

Depois de ter baixado um pacote do MySQL, você deve certificar-se de que seu checksum MD5 corresponde ao fornecido nas páginas de download do MySQL. Cada pacote tem um checksum individual que você pode verificar com o pacote que você baixou. O checksum MD5 correto está listado na página de downloads para cada produto do MySQL; você deve compará-lo com o checksum MD5 do arquivo (produto) que você baixou.

Cada sistema operacional e configuração oferece sua própria versão de ferramentas para verificar o MD5 checksum. Tipicamente, o comando é chamado \*\* md5sum \*\*, ou pode ser chamado \*\* md5 \*\*, e alguns sistemas operacionais não o enviam. No Linux, é parte do pacote \*\* GNU Text Utilities \*\*, que está disponível para uma ampla gama de plataformas. Você também pode baixar o código-fonte do \[<http://www.gnu.org/software/textutils/>]<http://www.gnu.org/software/textutils/>]. Se você tiver o OpenSSL instalado, você pode usar o comando \*\* openssl5 \* `package_name` em vez disso. Uma implementação do Windows da linha de comando \*\* md5sum \*\* está disponível em \[<http://www.fourlab.mich.md/>]<http://www.fourlab.mich.md/index.html>.

Linux e Microsoft Windows exemplos:

```
$> md5sum mysql-standard-8.4.6-linux-i686.tar.gz
aaab65abbec64d5e907dcd41b8699945  mysql-standard-8.4.6-linux-i686.tar.gz
```

```
$> md5.exe mysql-installer-community-8.4.6.msi
aaab65abbec64d5e907dcd41b8699945  mysql-installer-community-8.4.6.msi
```

Verifique se a soma de verificação resultante (a sequência de algarismos hexadecimais) corresponde à que aparece na página de descarregamento imediatamente abaixo da respectiva embalagem.

::: info Note

Certifique-se de verificar a soma de verificação do arquivo de arquivo (por exemplo, o arquivo `.zip`, `.tar.gz`, ou `.msi`) e não dos arquivos contidos no arquivo. Em outras palavras, verifique o arquivo antes de extrair seu conteúdo.

:::
