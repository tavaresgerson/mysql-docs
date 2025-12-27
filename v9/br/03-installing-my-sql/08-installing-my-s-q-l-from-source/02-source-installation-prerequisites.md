### 2.8.2 Pré-requisitos para Instalação de Fontes

A instalação do MySQL a partir de fontes requer várias ferramentas de desenvolvimento. Algumas dessas ferramentas são necessárias, independentemente de você usar uma distribuição padrão de fontes ou uma árvore de fontes de desenvolvimento. Outros requisitos de ferramentas dependem do método de instalação que você usar.

Para instalar o MySQL a partir de fontes, os seguintes requisitos de sistema devem ser atendidos, independentemente do método de instalação:

* **CMake**, que é usado como framework de compilação em todas as plataformas. **CMake** pode ser baixado em <http://www.cmake.org>.

* Um bom programa **make**. Embora algumas plataformas venham com suas próprias implementações de **make**, é altamente recomendável que você use o **GNU make** 3.75 ou posterior. Ele pode já estar disponível em seu sistema como **gmake**. O **GNU make** está disponível em <http://www.gnu.org/software/make/>.

Em sistemas semelhantes ao Unix, incluindo Linux, você pode verificar a versão do **make** do seu sistema da seguinte forma:

```
  $> make --version
  GNU Make 4.2.1
  ```

* O código-fonte do MySQL 9.5 permite o uso de recursos do C++17. Para habilitar o nível necessário de suporte ao C++17 em todas as plataformas suportadas, as seguintes versões mínimas do compilador se aplicam:

  + Linux: GCC 10 ou Clang 12
  + macOS: XCode 10
  + Solaris: GCC 11.4
  + Windows: Visual Studio 2019
* A compilação do MySQL no Windows requer a versão 10 ou posterior do Windows. (Os binários do MySQL compilados em versões recentes do Windows geralmente podem ser executados em versões mais antigas.) Você pode determinar a versão do Windows executando **WMIC.exe os get version** no Prompt de Comando do Windows.

* A API C do MySQL requer um compilador C++ ou C99 para compilar.
* Uma biblioteca SSL é necessária para o suporte de conexões criptografadas, entropia para a geração de números aleatórios e outras operações relacionadas à criptografia. Por padrão, a compilação usa a biblioteca OpenSSL instalada no sistema hospedeiro. Para especificar explicitamente a biblioteca, use a opção `WITH_SSL` ao invocar o **CMake**. Para obter informações adicionais, consulte a Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”.
* As bibliotecas C++ Boost são necessárias para compilar o MySQL (mas não para usá-lo). No MySQL 8.3 e versões posteriores, essas bibliotecas são sempre incluídas no pacote do MySQL.

Biblioteca [ncurses](https://www.gnu.org/software/ncurses/ncurses.html).

* Memória livre suficiente. Se você encontrar erros de compilação, como erro interno do compilador, ao compilar arquivos de código-fonte grandes, pode ser que você tenha memória insuficiente. Se estiver compilando em uma máquina virtual, tente aumentar a alocação de memória.

[ActiveState Perl](https://www.activestate.com/products/perl/). ou

Para instalar o MySQL a partir de uma distribuição de fonte padrão, uma das seguintes ferramentas é necessária para descompactuar o arquivo da distribuição:

* Para um arquivo **tar** compactado em formato `.tar.gz`: o GNU `gunzip` para descompactuar a distribuição e um **tar** razoável para descompactuar. Se o seu programa **tar** suportar a opção `z`, ele pode descompactuar e descompactuar o arquivo.

O **tar** do GNU é conhecido por funcionar. O **tar** padrão fornecido por alguns sistemas operacionais não consegue descompactuar os nomes de arquivos longos na distribuição do MySQL. Você deve baixar e instalar o **tar** do GNU, ou, se disponível, usar uma versão pré-instalada do **tar** do GNU. Geralmente, isso está disponível como **gnutar**, **gtar** ou como **tar** dentro de um diretório de Software Livre ou GNU, como `/usr/sfw/bin` ou `/usr/local/bin`. O **tar** do GNU está disponível em <https://www.gnu.org/software/tar/>.

* Para um arquivo ZIP `.zip`: **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

* Para um pacote RPM `.rpm`: O programa **rpmbuild**, usado para construir a distribuição, o descompacta.

Para instalar o MySQL a partir de uma árvore de código-fonte de desenvolvimento, são necessárias as seguintes ferramentas adicionais:

[GitHub Help](https://help.github.com/) fornece instruções para baixar e instalar o Git em diferentes plataformas.

* **bison** 2.1 ou posterior, disponível em <http://www.gnu.org/software/bison/>. (A versão 1 não é mais suportada.) Use a versão mais recente do **bison** sempre que possível; se você tiver problemas, atualize para uma versão posterior, em vez de reverter para uma versão anterior.

O **bison** está disponível em <http://www.gnu.org/software/bison/>. O `bison` para Windows pode ser baixado em <http://gnuwin32.sourceforge.net/packages/bison.htm>. Baixe o pacote rotulado “Pacote completo, excluindo fontes”. No Windows, a localização padrão para o **bison** é o diretório `C:\Program Files\GnuWin32`. Algumas ferramentas podem não conseguir encontrar o **bison** devido ao espaço no nome do diretório. Além disso, o Visual Studio pode simplesmente ficar preso se houver espaços no caminho. Você pode resolver esses problemas instalando em um diretório que não contenha espaços (por exemplo, `C:\GnuWin32`).

* No Solaris Express, **m4** deve ser instalado em conjunto com **bison**. **m4** está disponível em <http://www.gnu.org/software/m4/>.

Observação:

Se você precisar instalar algum programa, modifique a variável de ambiente **PATH** para incluir os diretórios onde os programas estão localizados. Consulte a Seção 6.2.9, “Definindo variáveis de ambiente”.

Se você encontrar problemas e precisar fazer um relatório de erro, use as instruções na Seção 1.6, “Como relatar erros ou problemas”.