### 2.8.2 Requisitos de instalação da fonte

A instalação do MySQL a partir da fonte requer várias ferramentas de desenvolvimento. Algumas dessas ferramentas são necessárias, independentemente de você usar uma distribuição padrão da fonte ou uma árvore de fonte de desenvolvimento. Outros requisitos de ferramentas dependem do método de instalação que você usar.

Para instalar o MySQL a partir do código-fonte, os seguintes requisitos de sistema devem ser atendidos, independentemente do método de instalação:

- **CMake**, que é usado como o framework de construção em todas as plataformas. **CMake** pode ser baixado em <http://www.cmake.org>.

- Um bom programa **make**. Embora algumas plataformas venham com suas próprias implementações de **make**, é altamente recomendável que você use o **make** GNU 3.75 ou posterior. Ele já pode estar disponível no seu sistema como **gmake**. O **make** GNU está disponível em <http://www.gnu.org/software/make/>.

  Em sistemas semelhantes ao Unix, incluindo o Linux, você pode verificar a versão do **make** do seu sistema da seguinte maneira:

  ```
  $> make --version
  GNU Make 4.2.1
  ```

- A partir do MySQL 8.0.26, o código-fonte do MySQL 8.0 permite o uso de recursos do C++17. Para habilitar o nível necessário de suporte ao C++17 em todas as plataformas suportadas, as seguintes versões mínimas do compilador são aplicáveis:

  - Linux: GCC 10 ou Clang 5

  - macOS: XCode 10

  - Solaris: (*MySQL 8.0.40 e versões anteriores*) GCC 10; (*MySQL 8.0.41 e versões posteriores*) GCC 11.4

  - Windows: Visual Studio 2019

- Para instalar o MySQL no Windows, é necessário ter a versão 10 ou superior do Windows. (Os binários do MySQL construídos em versões recentes do Windows geralmente podem ser executados em versões mais antigas.) Você pode determinar a versão do Windows executando **WMIC.exe os get version** no Prompt de Comando do Windows.

- A API C do MySQL requer um compilador C++ ou C99 para compilar.

- Uma biblioteca SSL é necessária para o suporte de conexões criptografadas, entropia para a geração de números aleatórios e outras operações relacionadas à criptografia. Por padrão, a compilação usa a biblioteca OpenSSL instalada no sistema do host. Para especificar explicitamente a biblioteca, use a opção `WITH_SSL` ao invocar o **CMake**. Para obter informações adicionais, consulte a Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”.

- As bibliotecas Boost C++ são necessárias para compilar o MySQL (mas não para usá-lo). A compilação do MySQL requer uma versão específica do Boost. Normalmente, é a versão atual do Boost, mas se uma distribuição de fonte MySQL específica exigir uma versão diferente, o processo de configuração para de com uma mensagem indicando a versão do Boost que ela exige. Para obter o Boost e suas instruções de instalação, visite o site oficial do Boost. Após o Boost ser instalado, informe ao sistema de construção onde os arquivos do Boost estão localizados de acordo com o valor definido para a opção `WITH_BOOST` ao invocar o CMake. Por exemplo:

  ```
  cmake . -DWITH_BOOST=/usr/local/boost_version_number
  ```

  Ajuste o caminho conforme necessário para combinar com sua instalação.

- A biblioteca ncurses.

- Memória livre suficiente. Se você encontrar erros de compilação, como erro interno do compilador, ao compilar arquivos de código-fonte grandes, pode ser que você tenha memória insuficiente. Se estiver compilando em uma máquina virtual, tente aumentar a alocação de memória.

- O Perl é necessário se você pretende executar scripts de teste. A maioria dos sistemas semelhantes ao Unix inclui o Perl. Para o Windows, você pode usar o ActiveState Perl ou o Strawberry Perl.

Para instalar o MySQL a partir de uma distribuição padrão, é necessário um dos seguintes programas para descompactuar o arquivo da distribuição:

- Para um arquivo **tar** compactado com `.tar.gz`: use o GNU `gunzip` para descompactação da distribuição e um **tar** razoável para descompactação. Se o seu programa **tar** suportar a opção `z`, ele pode descompactuar e descomprimir o arquivo.

  O **GNU tar** é conhecido por funcionar. O **tar** padrão fornecido por alguns sistemas operacionais não consegue descompactar os nomes de arquivos longos na distribuição do MySQL. Você deve baixar e instalar o **GNU tar**, ou, se disponível, usar uma versão pré-instalada do GNU tar. Geralmente, isso está disponível como **gnutar**, **gtar** ou como **tar** dentro de um diretório de software GNU ou de software livre, como `/usr/sfw/bin` ou `/usr/local/bin`. O **GNU tar** está disponível em <https://www.gnu.org/software/tar/>.

- Para um arquivo Zip `.zip`: **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

- Para um pacote RPM `.rpm`: O programa **rpmbuild**, usado para construir a distribuição, o descompacta.

Para instalar o MySQL a partir de um repositório de código-fonte de desenvolvimento, são necessárias as seguintes ferramentas adicionais:

- O sistema de controle de revisão Git é necessário para obter o código-fonte de desenvolvimento. O Suporte do GitHub fornece instruções para baixar e instalar o Git em diferentes plataformas.

- **bison** 2.1 ou posterior, disponível em <http://www.gnu.org/software/bison/>. (A versão 1 não é mais suportada.) Use a versão mais recente do **bison** sempre que possível; se você tiver problemas, atualize para uma versão posterior, em vez de retornar a uma versão anterior.

  O **bison** está disponível em <http://www.gnu.org/software/bison/>. O `bison` para Windows pode ser baixado em <http://gnuwin32.sourceforge.net/packages/bison.htm>. Baixe o pacote rotulado como “Pacote completo, excluindo fontes”. Em Windows, a localização padrão para o **bison** é o diretório `C:\Program Files\GnuWin32`. Algumas ferramentas podem não conseguir encontrar o **bison** devido ao espaço no nome do diretório. Além disso, o Visual Studio pode simplesmente ficar parado se houver espaços no caminho. Você pode resolver esses problemas instalando em um diretório que não contenha espaços (por exemplo, `C:\GnuWin32`).

- No Solaris Express, **m4** deve ser instalado em conjunto com **bison**. **m4** está disponível em <http://www.gnu.org/software/m4/>.

Nota

Se você precisar instalar algum programa, modifique a variável de ambiente `PATH` para incluir quaisquer diretórios nos quais os programas estão localizados. Veja a Seção 6.2.9, “Definindo Variáveis de Ambiente”.

Se você encontrar problemas e precisar fazer um relatório de erro, use as instruções na Seção 1.5, “Como relatar erros ou problemas”.
