### 2.1.2 Qual versão e distribuição do MySQL para instalar

Ao preparar a instalação do MySQL, decida qual versão e formato de distribuição (binário ou fonte) utilizar.

Primeiro, decida se deseja instalar a partir de uma série de correções de bugs, como o MySQL 8.4, ou usar uma versão de inovação, como o MySQL 9.5. Ambas as faixas incluem correções de bugs, enquanto uma versão de inovação inclui as funcionalidades mais recentes. Tanto as versões de correções de bugs quanto as de inovação são destinadas ao uso em produção.

O esquema de nomenclatura no MySQL 8.0 utiliza nomes de versão que consistem em três números e um sufixo opcional (por exemplo, **mysql-8.0.34**). Os números dentro do nome da versão são interpretados da seguinte forma:

- O primeiro número (**8**) é o número da versão principal.

- O segundo número (**0**) é o número da versão menor. Juntos, os números principal e menor constituem o número da série de lançamento. O número da série descreve o conjunto de recursos estáveis.

- O terceiro número (**34**) é o número da versão dentro da série de lançamentos. Ele é incrementado para cada nova versão de correção de bugs; para uma versão de inovação, provavelmente sempre será 0. Para uma série de correção de bugs, como o MySQL 8.0, a versão mais recente dentro da série é a melhor escolha.

Depois de escolher a versão do MySQL a ser instalada, decida qual formato de distribuição instalar para o seu sistema operacional. Para a maioria dos casos de uso, uma distribuição binária é a escolha certa. Distribuições binárias estão disponíveis no formato nativo para muitas plataformas, como pacotes RPM para Linux ou pacotes DMG para macOS. As distribuições também estão disponíveis em formatos mais genéricos, como arquivos Zip ou arquivos **tar** comprimidos. No Windows, você pode usar o Instalador do MySQL para instalar uma distribuição binária.

Em algumas circunstâncias, pode ser preferível instalar o MySQL a partir de uma distribuição de fonte:

- Você deseja instalar o MySQL em um local específico. As distribuições binárias padrão estão prontas para serem executadas em qualquer local de instalação, mas você pode precisar de ainda mais flexibilidade para colocar os componentes do MySQL onde desejar.

- Você deseja configurar o **mysqld** com recursos que podem não estar incluídos nas distribuições binárias padrão. Aqui está uma lista das opções extras mais comuns usadas para garantir a disponibilidade dos recursos:

  - `-DWITH_LIBWRAP=1` para suporte a wrappers TCP.

  - `-DWITH_ZLIB={system|bundled}` para recursos que dependem da compressão

  - `-DWITH_DEBUG=1` para suporte de depuração

  Para obter informações adicionais, consulte a Seção 2.8.7, “Opções de Configuração de Fonte do MySQL”.

- Você deseja configurar o **mysqld** sem alguns recursos que estão incluídos nas distribuições binárias padrão.

- Você deseja ler ou modificar o código C e C++ que compõe o MySQL. Para isso, obtenha uma distribuição de código-fonte.

- As distribuições de fonte contêm mais testes e exemplos do que as distribuições binárias.
