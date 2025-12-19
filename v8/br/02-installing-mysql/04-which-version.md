### 2.1.2 Qual versão e distribuição do MySQL instalar

Ao se preparar para instalar o MySQL, decida qual versão e formato de distribuição (binário ou de origem) usar.

Primeiro, decida se instalará a partir de uma série LTS como o MySQL 8.4, ou instalará a partir de uma série de Inovação como o MySQL 9.5.

O esquema de nomeação no MySQL 8.4 usa nomes de versão que consistem em três números e um sufixo opcional (por exemplo, \*\* mysql-8.4.0 \*\*). Os números dentro do nome da versão são interpretados da seguinte forma:

- O primeiro número (**8**) é o número da versão principal.
- O segundo número (**4**) é o número da versão menor. O número da versão menor não muda para uma série LTS, mas muda para uma série Innovation.
- O terceiro número (**0**) é o número de versão dentro de uma série LTS. Este é incrementado para cada nova versão LTS, mas provavelmente é sempre 0 para versões de inovação.

Depois de escolher qual versão do MySQL instalar, decida qual formato de distribuição instalar para o seu sistema operacional. Para a maioria dos casos de uso, uma distribuição binária é a escolha certa. Distribuições binárias estão disponíveis em formato nativo para muitas plataformas, como pacotes RPM para Linux ou pacotes DMG para macOS. Distribuições também estão disponíveis em formatos mais genéricos, como arquivos Zip ou arquivos **tar** compactados. No Windows, você pode usar um MSI para instalar uma distribuição binária.

Em algumas circunstâncias, pode ser preferível instalar o MySQL a partir de uma distribuição de origem:

- As distribuições binárias padrão estão prontas para serem executadas em qualquer local de instalação, mas você pode precisar de ainda mais flexibilidade para colocar componentes MySQL onde quiser.
- Você deseja configurar **mysqld** com recursos que podem não ser incluídos nas distribuições binárias padrão. Aqui está uma lista das opções extras mais comuns usadas para garantir a disponibilidade de recursos:

  - `-DWITH_LIBWRAP=1` para suporte de wrappers TCP.
  - `-DWITH_ZLIB={system|bundled}` para características que dependem da compressão
  - `-DWITH_DEBUG=1` para suporte de depuração

  Para informações adicionais, ver Secção 2.8.7, "Opções de configuração de origem do MySQL".
- Você quer configurar **mysqld** sem alguns recursos que estão incluídos nas distribuições binárias padrão.
- Você deseja ler ou modificar o código C e C++ que compõe o MySQL. Para este propósito, obtenha uma distribuição de origem.
- As distribuições de origem contêm mais testes e exemplos do que as distribuições binárias.
