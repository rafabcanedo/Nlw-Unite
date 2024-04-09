import { ChangeEvent, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal, Search } from "lucide-react";
import { IconButton } from "./icon-button";

import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";

import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface Member {
 id: string
 name: string
 email: string
 createdAt: string
 checkedInAt: string | null // ele pode ser null (no backend)
}

export function MemberList() {

 const [ search, setSearch ] = useState("")
 const [page, setPage ] = useState(1)

 const [ total, setTotal ] = useState(0)
 const [ members, setMembers ] = useState<Member[]>([])

 const totalPages = Math.ceil(total / 10)

 useEffect(() => {
  const url = new URL('http://localhost:3333/events/04b1b1ec-65e2-4d8e-84b8-5212b3239114/members')

  url.searchParams.set('pageIndex', String(page - 1))

  if (search.length > 0) {
  url.searchParams.set('query', search)
  }
  
  fetch(url)
  .then(response => response.json())
  .then(data => {
    setMembers(data.members)
    setTotal(data.total)
  })
 }, [page, search])

 function setCurrentPage(page: number) {
  const url = new URL(window.location.toString());

  url.searchParams.set("page", String(page));

  window.history.pushState({}, "", url);

  setPage(page);
}

 function onSearchInputChanged(event: ChangeEvent<HTMLInputElement>) {
  setSearch(event.target.value)
  setCurrentPage(1)
 }

 function goToFirstPage() {
  setCurrentPage(1)
 }

 function goToLastPage() {
  setCurrentPage(totalPages)
 }

 function goToPreviousPage() {
  setCurrentPage(page - 1)
 }

 function goToNextPage() {
  setCurrentPage(page + 1)
 }

 return (
  <div>
  <div className="flex gap-3 items-center">
   <h1 className="text-2xl font-bold">MemberList</h1>
   
   <div className="px-3 w-72 py-1.5 border border-white/10 bg-transparent rounded-lg text-sm flex items-center gap-3">
    <Search className="size-4 text-emerald-300" />
   <input
    onChange={onSearchInputChanged}
    className="bg-transparent focus:ring-0 flex-1 outline-none border-0 p-0 text-sm"
    placeholder="Buscar Membro..."
   />
   </div>
  </div>

        <Table>
          <thead>
            <tr className="border-b border-white/10">
              <TableHeader
                style={{ width: 48 }}
              >
                <input type="checkbox" className="size-4 bg-black/20 rounded border border-white/10" />
              </TableHeader>
              <TableHeader>Código</TableHeader>
              <TableHeader>Participante</TableHeader>
              <TableHeader>
                Data de inscrição
              </TableHeader>
              <TableHeader>
                Data do check-in
              </TableHeader>
              <TableHeader
                style={{ width: 64 }}
              ></TableHeader>
            </tr>
          </thead>
          <tbody>
          {members.map((member) => {
            return (
              <TableRow key={member.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="size-4 bg-black/20 rounded border border-white/10"
                  />
                </TableCell>
                <TableCell>{member.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {member.name}
                    </span>
                    <span>{member.email}</span>
                  </div>
                </TableCell>
                <TableCell>{dayjs().to(member.createdAt)}</TableCell>
                <TableCell>
                  {member.checkedInAt === null ? (
                    <span className="text-zinc-400">Não fez check-in</span>
                  ) : (
                    dayjs().to(member.checkedInAt)
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    transparent
                    className="bg-black/20 border border-white/10 rounded-md p-1.5"
                  >
                    <MoreHorizontal className="size-4" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
          </tbody>
          <tfoot>
            <tr>
              <TableCell>
                Mostrando {members.length} de {total} itens
              </TableCell>
              <td className="py-3 px-4 text-sm text-zinc-300 text-right" colSpan={3}>
                <div className="inline-flex items-center gap-8">
                  <span>Página {page} de {totalPages}</span>

                  <div className="flex gap-1.5">
                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                      <ChevronsLeft className="size-4" />
                    </IconButton>
                    <IconButton onClick={goToPreviousPage} disabled={page === 1}>
                      <ChevronLeft className="size-4" />
                    </IconButton>
                    <IconButton onClick={goToNextPage} disabled={page === totalPages}>
                      <ChevronRight className="size-4" />
                    </IconButton>
                    <IconButton onClick={goToLastPage} disabled={page === totalPages}>
                      <ChevronsRight className="size-4" />
                    </IconButton>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </Table>
  </div>
 )
}