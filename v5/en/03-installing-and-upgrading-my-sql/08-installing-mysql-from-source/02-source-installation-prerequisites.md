### 2.8.2 Pré-requisitos para Instalação a Partir do Código-Fonte

A instalação do MySQL a partir do código-fonte requer diversas ferramentas de desenvolvimento. Algumas dessas ferramentas são necessárias, independentemente de você usar uma distribuição de código-fonte padrão ou uma *development source tree* (árvore de código-fonte de desenvolvimento). Outros requisitos de ferramentas dependem do método de instalação que você utiliza.

Para instalar o MySQL a partir do código-fonte, os seguintes requisitos de sistema devem ser satisfeitos, independentemente do método de instalação:

* **CMake**, que é usado como a estrutura de *build* (construção) em todas as plataformas. O **CMake** pode ser baixado em <http://www.cmake.org>.

* Um bom programa **make**. Embora algumas plataformas venham com suas próprias implementações de **make**, é altamente recomendável que você use o GNU **make** 3.75 ou posterior. Ele pode já estar disponível em seu sistema como **gmake**. O GNU **make** está disponível em <http://www.gnu.org/software/make/>.

  Em sistemas tipo Unix, incluindo Linux, você pode verificar a versão do **make** do seu sistema desta forma:

  ```sql
  $> make --version
  GNU Make 4.2.1
  ```

* Um compilador ANSI C++ funcional. Consulte a descrição da opção `FORCE_UNSUPPORTED_COMPILER` para algumas diretrizes.

* Uma biblioteca SSL é necessária para oferecer suporte a conexões criptografadas, entropia para geração de números aleatórios e outras operações relacionadas à criptografia. Por padrão, o *build* usa a biblioteca OpenSSL instalada no sistema *host*. Para especificar a biblioteca explicitamente, use a opção `WITH_SSL` ao invocar o **CMake**. Para obter informações adicionais, consulte a Seção 2.8.6, “Configuring SSL Library Support”.

* As bibliotecas Boost C++ são necessárias para construir o MySQL (*build*, mas não para usá-lo). O Boost 1.59.0 deve estar instalado. Para obter o Boost e suas instruções de instalação, visite [o site oficial do Boost](https://www.boost.org). Após a instalação do Boost, informe ao sistema de *build* onde os arquivos Boost estão localizados, de acordo com o valor definido para a opção `WITH_BOOST` ao invocar o CMake. Por exemplo:

  ```sql
  cmake . -DWITH_BOOST=/usr/local/boost_version_number
  ```

  Ajuste o *path* conforme necessário para corresponder à sua instalação.

* A biblioteca [ncurses](https://www.gnu.org/software/ncurses/ncurses.html).

* Memória livre suficiente. Se você encontrar erros de *build*, como *internal compiler error* ao compilar arquivos de código-fonte grandes, pode ser que você tenha pouca memória. Se estiver compilando em uma máquina virtual, tente aumentar a alocação de memória.

* Perl é necessário se você pretende executar *test scripts*. A maioria dos sistemas tipo Unix inclui Perl. Para Windows, você pode usar [ActiveState Perl](https://www.activestate.com/products/perl/). ou [Strawberry Perl](https://strawberryperl.com/).

Para instalar o MySQL a partir de uma distribuição de código-fonte padrão, uma das seguintes ferramentas é necessária para descompactar o arquivo de distribuição (*unpack*):

* Para um arquivo **tar** comprimido `.tar.gz`: GNU `gunzip` para descomprimir a distribuição e um **tar** razoável para desempacotá-lo (*unpack*). Se o seu programa **tar** suportar a opção `z`, ele pode descomprimir e desempacotar o arquivo.

  Sabe-se que o GNU **tar** funciona. O **tar** padrão fornecido com alguns sistemas operacionais não é capaz de desempacotar (*unpack*) os nomes de arquivo longos na distribuição do MySQL. Você deve baixar e instalar o GNU **tar**, ou se disponível, usar uma versão pré-instalada do GNU tar. Geralmente, ele está disponível como **gnutar**, **gtar** ou como **tar** em um diretório GNU ou Free Software, como `/usr/sfw/bin` ou `/usr/local/bin`. O GNU **tar** está disponível em <https://www.gnu.org/software/tar/>.

* Para um arquivo Zip (`.zip`): **WinZip** ou outra ferramenta que possa ler arquivos `.zip`.

* Para um pacote RPM (`.rpm`): O programa **rpmbuild** usado para construir a distribuição o desempacota (*unpacks*).

Para instalar o MySQL a partir de uma *development source tree* (árvore de código-fonte de desenvolvimento), as seguintes ferramentas adicionais são necessárias:

* O sistema de controle de revisão Git é necessário para obter o código-fonte de desenvolvimento. O [GitHub Help](https://help.github.com/) fornece instruções para baixar e instalar o Git em diferentes plataformas.

* **bison** 2.1 ou posterior, disponível em <http://www.gnu.org/software/bison/>. (A Versão 1 não é mais suportada.) Use a versão mais recente do **bison** sempre que possível; se você tiver problemas, atualize para uma versão posterior, em vez de reverter para uma anterior.

  O **bison** está disponível em <http://www.gnu.org/software/bison/>. O `bison` para Windows pode ser baixado em <http://gnuwin32.sourceforge.net/packages/bison.htm>. Baixe o pacote rotulado “Complete package, excluding sources”. No Windows, o local padrão para o **bison** é o diretório `C:\Program Files\GnuWin32`. Algumas utilidades podem falhar ao encontrar o **bison** devido ao espaço no nome do diretório. Além disso, o Visual Studio pode simplesmente travar se houver espaços no *path*. Você pode resolver esses problemas instalando em um diretório que não contenha espaço (por exemplo, `C:\GnuWin32`).

* No Solaris Express, o **m4** deve ser instalado, além do **bison**. O **m4** está disponível em <http://www.gnu.org/software/m4/>.

Note

Se você precisar instalar qualquer programa, modifique sua variável de ambiente `PATH` para incluir todos os diretórios nos quais os programas estão localizados. Consulte a Seção 4.2.7, “Setting Environment Variables”.

Se você encontrar problemas e precisar registrar um relatório de *bug*, use as instruções na Seção 1.5, “How to Report Bugs or Problems”.